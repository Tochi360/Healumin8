import { CheckIcon } from "@radix-ui/react-icons";

import clsx from "clsx";

import { Section } from "@/common/layout";
import { Heading } from "@/common/heading";
import { fragmentOn } from "basehub";
import { darkLightImageFragment } from "@/lib/basehub/fragments";
import { DarkLightImage } from "@/common/dark-light-image";

export const featureCardFragment = fragmentOn("FeaturesCardsListItem", {
  _title: true,
  description: true,
  image: darkLightImageFragment,
  characteristics: {
    items: { _title: true },
  },
});

export const featureCardsComponent = fragmentOn("FeaturesCardsComponent", {
  heading: {
    subtitle: true,
    tag: true,
    title: true,
  },
  featuresCardsList: {
    items: featureCardFragment,
  },
});

type FeatureCard = fragmentOn.infer<typeof featureCardsComponent>;

const DEFAULT_FIRST_CARD_CHARACTERISTICS = [
  { _title: "Handwritten Text Recognition (HTR) for legacy files" },
  { _title: "Bulk scanning & structured extraction" },
  { _title: "Secure cloud storage (end-to-end encrypted)" },
  { _title: "Offline-first support for low-connectivity environments" },
  { _title: "Creates structured, standardized patient records from paper" },
];

export async function FeaturesList({
  featuresCardsList,
  heading,
  firstCardCharacteristicsOverride,
  mainTitleOverride,
  cardFramed = true,
  hideDescriptions = false,
  firstCardTitleOverride,
}: FeatureCard & {
  firstCardCharacteristicsOverride?: { _title: string }[];
  mainTitleOverride?: string;
  cardFramed?: boolean;
  hideDescriptions?: boolean;
  firstCardTitleOverride?: string;
}) {
  const cards = featuresCardsList.items.map((item, index) => {
    if (index === 0) {
      return {
        ...item,
        _title:
          firstCardTitleOverride ?? "Digitization Engine (Our Wedge)",
        description: "We help paper-based hospitals go digital in weeks.",
        image: {
          ...item.image,
          dark: {
            ...item.image.dark,
            url: "/images/digitization-engine.png",
            alt:
              item.image.dark?.alt ??
              "Paper hospital records being converted into structured digital patient profiles",
            height: 558,
            width: 1024,
            aspectRatio: "1024/558",
            blurDataURL: "",
          },
          light: {
            ...item.image.light,
            url: "/images/digitization-engine.png",
            alt:
              item.image.light?.alt ??
              "Paper hospital records being converted into structured digital patient profiles",
            height: 558,
            width: 1024,
            aspectRatio: "1024/558",
            blurDataURL: "",
          },
        },
        characteristics: {
          items:
            firstCardCharacteristicsOverride ?? DEFAULT_FIRST_CARD_CHARACTERISTICS,
        },
      };
    }
    if (index === 1) {
      return {
        ...item,
        _title: "Interoperable EHR (Standards Native)",
        description: "We don’t build isolated hospital software. We build standards-native infrastructure.",
        image: {
          ...item.image,
          dark: {
            ...item.image.dark,
            url: "/images/interoperable-network.png",
            alt:
              item.image.dark?.alt ??
              "Diagram of hospitals and clinics connected to a central health data hub",
            height: 558,
            width: 1024,
            aspectRatio: "1024/558",
            blurDataURL: "",
          },
          light: {
            ...item.image.light,
            url: "/images/interoperable-network.png",
            alt:
              item.image.light?.alt ??
              "Diagram of hospitals and clinics connected to a central health data hub",
            height: 558,
            width: 1024,
            aspectRatio: "1024/558",
            blurDataURL: "",
          },
        },
        characteristics: {
          items: [
            { _title: "FHIR/HL7 compliant architecture" },
            { _title: "API-first system" },
            { _title: "Third-party integration ready" },
            { _title: "Insurance integration capable" },
            { _title: "Data can move across systems — not remain siloed" },
          ],
        },
      };
    }
    if (index === 2) {
      return {
        ...item,
        _title: "Patient-Owned Records",
        description: "Patients should not lose their medical history when they change hospitals.",
        image: {
          ...item.image,
          dark: {
            ...item.image.dark,
            url: "/images/patient-owned-records.png",
            alt:
              item.image.dark?.alt ??
              "Patient viewing a secure health record app that aggregates data from multiple hospitals",
            height: 558,
            width: 1024,
            aspectRatio: "1024/558",
            blurDataURL: "",
          },
          light: {
            ...item.image.light,
            url: "/images/patient-owned-records.png",
            alt:
              item.image.light?.alt ??
              "Patient viewing a secure health record app that aggregates data from multiple hospitals",
            height: 558,
            width: 1024,
            aspectRatio: "1024/558",
            blurDataURL: "",
          },
        },
        characteristics: {
          items: [
            { _title: "Secure record portability" },
            { _title: "Role-based sharing controls" },
            { _title: "Longitudinal health timeline across providers" },
            { _title: "Hospitals remain central — we augment, not replace them" },
          ],
        },
      };
    }
    return item;
  });

  return (
    <Section container="default">
      <Heading subtitle={heading.subtitle ?? ""} tag={heading.tag}>
        <h4>{mainTitleOverride ?? "Our Solution"}</h4>
      </Heading>
      <div className="flex flex-col gap-6">
        {cards.map(({ image, ...item }) => (
          <article
            key={item._title}
            className={clsx(
              "flex min-h-96 w-full max-w-[380px] flex-col sm:max-w-full md:w-full md:flex-row md:odd:flex-row-reverse xl:gap-16",
              cardFramed &&
                "rounded-lg border border-border bg-surface-secondary p-px dark:border-dark-border dark:bg-dark-surface-secondary",
            )}
          >
            <figure className="p-2 md:h-auto md:w-[360px] lg:w-[480px] xl:w-[560px]">
              <DarkLightImage
                {...image}
                className="block aspect-video h-[200px] w-full rounded-lg border border-border object-cover dark:border-dark-border md:h-full"
                height={748}
                width={1120}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 480px, 560px"
              />
            </figure>
            <div className="flex flex-col gap-8 p-5 pt-6 md:flex-1 md:p-10">
              <div className="flex flex-col items-start gap-2">
                <h5 className="text-2xl font-medium text-text-primary dark:text-dark-text-primary md:text-3xl">
                  {item._title}
                </h5>
                {!hideDescriptions && (
                  <p className="font-normal text-text-secondary dark:text-dark-text-secondary md:text-lg">
                    {item.description}
                  </p>
                )}
              </div>
              <ul className="flex flex-col items-start gap-3 pl-2 md:text-lg">
                {item.characteristics.items.map(({ _title }) => (
                  <li
                    key={_title}
                    className="flex items-center gap-4 font-normal text-text-secondary dark:text-dark-text-secondary"
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-surface-tertiary dark:bg-dark-surface-tertiary">
                      <CheckIcon className="text-text-tertiary dark:text-dark-text-tertiary" />
                    </span>
                    {_title}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
