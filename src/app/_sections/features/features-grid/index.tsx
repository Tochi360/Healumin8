import { BaseHubImage } from "basehub/next-image";

import { Heading } from "@/common/heading";
import { Section } from "@/common/layout";
import { fragmentOn } from "basehub";
import { headingFragment } from "@/lib/basehub/fragments";
import { GeneralEvents } from "@/../basehub-types";

export const featuresGridFragment = fragmentOn("FeaturesGridComponent", {
  _analyticsKey: true,
  featuresGridList: {
    items: {
      _id: true,
      _title: true,
      description: true,
      icon: {
        alt: true,
        url: true,
      },
    },
  },
  heading: headingFragment,
});

type FeaturesGrid = fragmentOn.infer<typeof featuresGridFragment>;

const WHY_NOW_ITEMS: { _title: string; description: string }[] = [
  {
    _title: "Paper-Based Systems",
    description:
      "Large portions of healthcare in emerging markets remain paper-based.",
  },
  {
    _title: "Government Push",
    description: "Governments are pushing digital health transformation.",
  },
  {
    _title: "Missing Infrastructure",
    description: "The infrastructure layer is missing.",
  },
  {
    _title: "Rising Insurance Penetration",
    description: "Insurance penetration is increasing.",
  },
  {
    _title: "AI Needs Structured Data",
    description: "AI models require structured medical datasets.",
  },
];

export function FeaturesGrid({
  heading,
  featuresGridList,
  eventsKey,
  useWhyNowContent,
}: FeaturesGrid & {
  eventsKey: GeneralEvents["ingestKey"];
  useWhyNowContent?: boolean;
}) {
  const items = useWhyNowContent
    ? WHY_NOW_ITEMS.map((item, i) => {
        const base = featuresGridList.items[i] ?? featuresGridList.items[0];
        return {
          _id: base?._id ?? `why-now-${i}`,
          _title: item._title,
          description: item.description,
          icon: base?.icon ?? { alt: "", url: "" },
        };
      })
    : featuresGridList.items;

  const effectiveHeading = useWhyNowContent
    ? {
        ...heading,
        tag: "Why Now",
        title: "The right moment for change",
        subtitle:
          "A convergence of factors makes this the right moment for healthcare infrastructure.",
      }
    : heading;

  return (
    <Section>
      <Heading {...effectiveHeading}>
        <h4>{effectiveHeading.title}</h4>
      </Heading>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        {items.map(({ _id, _title, description, icon }) => (
          <article
            key={_id}
            className="border-border dark:border-dark-border flex flex-col gap-4 rounded-lg border p-4 [box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] dark:[box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset]"
          >
            <figure className="border-border bg-surface-secondary dark:border-dark-border dark:bg-dark-surface-secondary flex size-9 items-center justify-center rounded-full border p-2">
              <BaseHubImage
                alt={icon.alt ?? _title}
                className="dark:invert"
                height={18}
                src={icon.url}
                width={18}
              />
            </figure>
            <div className="flex flex-col items-start gap-1">
              <h5 className="text-lg font-medium">{_title}</h5>
              <p className="text-text-secondary dark:text-dark-text-secondary text-pretty">
                {description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
