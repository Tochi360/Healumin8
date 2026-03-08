import NextForm from "next/form";
import { Section } from "@/common/layout";
import { fragmentOn } from "basehub";
import { buttonFragment } from "@/lib/basehub/fragments";
import { FormLayout, RichTextFormWrapper } from "@/app/_components/form-layout";
import { Button } from "@/common/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { LabeledInput, LabeledTextarea, LabeledWrapper } from "@/app/_components/labeled-input";
import { sendEvent, parseFormData } from "basehub/events";
import { Select } from "@/app/_components/select";
import { sendDemoEmail } from "@/app/actions/send-demo-email";

export const formFragment = fragmentOn("FormComponent", {
  title: true,
  subtitle: {
    json: {
      content: true,
    },
  },
  cta: buttonFragment,
  submissions: {
    ingestKey: true,
    schema: true,
  },
});
type Form = fragmentOn.infer<typeof formFragment>;

export function Form(
  props: Form & {
    /** When set, form submissions are also emailed to this address (e.g. Hello@healumin8.com). */
    submissionsEmail?: string;
  },
) {
  const { submissionsEmail, ...formProps } = props;
  return (
    <Section>
      <FormLayout
        subtitle={
          formProps.subtitle ? (
            <RichTextFormWrapper>{formProps.subtitle.json.content}</RichTextFormWrapper>
          ) : null
        }
        title={formProps.title}
      >
        <NextForm
          className="flex flex-col gap-3"
          action={async (data) => {
            "use server";
            const parsedData = parseFormData(
              formProps.submissions.ingestKey,
              formProps.submissions.schema,
              data,
            );
            if (!parsedData.success) {
              throw new Error(JSON.stringify(parsedData.errors));
            }
            await sendEvent(
              formProps.submissions.ingestKey,
              // @ts-expect-error -- basehub events are typed based on the schema, but this Form component should be generic
              parsedData.data,
            );
            if (submissionsEmail) {
              const schema = formProps.submissions.schema.map((f) => ({
                label: f.label,
                name: f.name,
              }));
              const { error } = await sendDemoEmail(
                submissionsEmail,
                parsedData.data as Record<string, unknown>,
                schema,
              );
              if (error) {
                console.error("[Form] Email send failed:", error.message);
                // Don't throw—form submission still succeeds; fix RESEND_API_KEY / Resend domain in dashboard
              }
            }
          }}
        >
          {formProps.submissions.schema.map((field) => {
            if (field.type === "textarea") {
              return (
                <LabeledTextarea key={field.id} rows={8} className="max-h-64 min-h-16" {...field} />
              );
            } else if (field.type === "select" || field.type === "radio") {
              return (
                <LabeledWrapper key={field.id} label={field.label} id={field.id}>
                  <Select id={field.id} name={field.name} required={field.required}>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </LabeledWrapper>
              );
            } else {
              return <LabeledInput key={field.id} {...field} />;
            }
          })}
          <div className="mt-3 flex items-center justify-between">
            <Button
              icon={formProps.cta.icon ?? <ArrowRightIcon className="size-5" />}
              iconSide="right"
              intent={formProps.cta.type}
              type="submit"
            >
              {formProps.cta.label}
            </Button>
          </div>
        </NextForm>
      </FormLayout>
    </Section>
  );
}
