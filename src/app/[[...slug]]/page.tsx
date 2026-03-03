import type { Metadata } from "next";
import { Fragment } from "react";

import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { Pump } from "basehub/react-pump";
import { GeneralEvents } from "@/../basehub-types";
import { basehub, fragmentOn } from "basehub";

import { AccordionFaq } from "../_sections/accordion-faq";
import { BigFeature, bigFeatureFragment } from "../_sections/features/big-feature";
import { Callout, calloutFragment } from "../_sections/callout-1";
import { Callout2, calloutv2Fragment } from "../_sections/callout-2";
import { Companies, companiesFragment } from "../_sections/companies";
import { Faq, faqFragment } from "../_sections/faq";
import { FeaturesGrid, featuresGridFragment } from "../_sections/features/features-grid";
import { FeaturesList, featureCardsComponent } from "../_sections/features/features-list";
import { Hero, heroFragment } from "../_sections/hero";
import { Pricing, pricingFragment } from "../_sections/pricing";
import { SideFeatures, featuresSideBySideFragment } from "../_sections/features/side-features";
import { Testimonials, testimonialsSliderFragment } from "../_sections/testimonials";
import { TestimonialsGrid, testimonialsGridFragment } from "../_sections/testimonials-grid";
import { PricingTable } from "../_sections/pricing-comparation";
import { pricingTableFragment } from "../_sections/pricing-comparation/fragments";
import FeatureHero, { featureHeroFragment } from "../_sections/features/hero";
import { PageView } from "../_components/page-view";
import { FreeformText, freeformTextFragment } from "../_sections/freeform-text";
import { Form, formFragment } from "../_sections/form";

const FAQ_OVERRIDE_ITEMS = [
  {
    _analyticsKey: "",
    _title: "Are you replacing existing hospital systems?",
    answer:
      "No. We support and upgrade them. Paper hospitals get digitized. Digital hospitals get standardized and connected.",
  },
  {
    _analyticsKey: "",
    _title: "How are you different from traditional hospital software?",
    answer:
      "Most hospital systems are siloed. We are built for interoperability, so data can move across hospitals with patients consent instead of staying locked in one system.",
  },
  {
    _analyticsKey: "",
    _title: "Why focus on paper-based hospitals?",
    answer:
      "Many hospitals in emerging markets still rely on manual records. Digitizing them creates immediate value and unlocks structured data that does not currently exist.",
  },
  {
    _analyticsKey: "",
    _title: "How do you protect patient data?",
    answer:
      "We use end to end encryption, role based access controls, and full audit logs. Patients control who can access their records.",
  },
  {
    _analyticsKey: "",
    _title: "Are you building AI models?",
    answer:
      "Not initially. We are building the data infrastructure first. AI becomes possible once the foundation is in place.",
  },
];

export const dynamic = "force-static";

export const generateStaticParams = async () => {
  const data = await basehub().query({
    site: {
      pages: {
        items: {
          pathname: true,
        },
      },
    },
  });

  return data.site.pages.items.map((item) => ({
    slug: item.pathname.split("/").filter(Boolean),
  }));
};

export const generateMetadata = async ({
  params: _params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata | undefined> => {
  const params = await _params;
  const data = await basehub({ draft: (await draftMode()).isEnabled }).query({
    site: {
      settings: { metadata: { defaultTitle: true, titleTemplate: true, defaultDescription: true } },
      pages: {
        __args: {
          filter: {
            pathname: {
              eq: params.slug ? `/${params.slug.join("/")}` : "/",
            },
          },
        },
        items: {
          metadataOverrides: {
            title: true,
            description: true,
          },
        },
      },
    },
  });

  const page = data.site.pages.items.at(0);

  if (!page) {
    return notFound();
  }

  return {
    title: page.metadataOverrides.title ?? data.site.settings.metadata.defaultTitle,
    description:
      page.metadataOverrides.description ?? data.site.settings.metadata.defaultDescription,
  };
};

function SectionsUnion({
  comp,
  eventsKey,
}: {
  comp: NonNullable<fragmentOn.infer<typeof sectionsFragment>["sections"]>[number];
  eventsKey: GeneralEvents["ingestKey"];
}): React.ReactNode {
  switch (comp.__typename) {
    case "HeroComponent":
      return <Hero {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "FeaturesCardsComponent":
      return <FeaturesList {...comp} key={comp._id} />;
    case "FeaturesGridComponent":
      return <FeaturesGrid {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "CompaniesComponent":
      return <Companies {...comp} key={comp._id} />;
    case "FeaturesBigImageComponent":
      return <BigFeature {...comp} key={comp._id} />;
    case "FeaturesSideBySideComponent":
      return <SideFeatures {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "CalloutComponent":
      return <Callout {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "CalloutV2Component":
      return <Callout2 {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "TestimonialSliderComponent":
      return <Testimonials {...comp} key={comp._id} />;
    case "TestimonialsGridComponent":
      return <TestimonialsGrid {...comp} key={comp._id} />;
    case "PricingComponent":
      return <Pricing {...comp} key={comp._id} />;
    case "FaqComponent":
      return <Faq {...comp} key={comp._id} />;
    case "FaqComponent":
      return <AccordionFaq {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "PricingTableComponent":
      return <PricingTable {...comp} key={comp._id} />;
    case "FeatureHeroComponent":
      return <FeatureHero {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "FreeformTextComponent":
      return <FreeformText {...comp} key={comp._id} />;
    case "FormComponent":
      return <Form {...comp} key={comp._id} />;
    default:
      return null;
  }
}

const sectionsFragment = fragmentOn("PagesItem", {
  sections: {
    __typename: true,
    on_BlockDocument: { _id: true, _slug: true },
    on_HeroComponent: heroFragment,
    on_FeaturesCardsComponent: featureCardsComponent,
    on_FeaturesSideBySideComponent: featuresSideBySideFragment,
    on_FeaturesBigImageComponent: bigFeatureFragment,
    on_FeaturesGridComponent: featuresGridFragment,
    on_CompaniesComponent: companiesFragment,
    on_CalloutComponent: calloutFragment,
    on_CalloutV2Component: calloutv2Fragment,
    on_TestimonialSliderComponent: testimonialsSliderFragment,
    on_TestimonialsGridComponent: testimonialsGridFragment,
    on_PricingComponent: pricingFragment,
    on_PricingTableComponent: pricingTableFragment,
    on_FeatureHeroComponent: featureHeroFragment,
    on_FaqComponent: {
      layout: true,
      ...faqFragment,
    },
    on_FreeformTextComponent: freeformTextFragment,
    on_FormComponent: formFragment,
  },
});

export default async function DynamicPage({
  params: _params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await _params;
  const slugs = params.slug;

  return (
    <Pump
      queries={[
        {
          site: {
            pages: {
              __args: {
                filter: {
                  pathname: {
                    eq: slugs ? `/${slugs.join("/")}` : "/",
                  },
                },
                first: 1,
              },
              items: {
                _analyticsKey: true,
                _id: true,
                pathname: true,
                sections: sectionsFragment.sections,
              },
            },
            generalEvents: {
              ingestKey: true,
            },
          },
        },
      ]}
    >
      {async ([
        {
          site: { pages, generalEvents },
        },
      ]) => {
        "use server";

        const page = pages.items[0];

        if (!page) notFound();

        const sections = page.sections?.filter(
          (section) =>
            section.__typename !== "PricingComponent" &&
            section.__typename !== "PricingTableComponent" &&
            section.__typename !== "TestimonialSliderComponent",
        );

        const slugs = params?.slug ?? [];
        const isHome = slugs.length === 0;
        const firstFeaturesIndex = sections?.findIndex(
          (s) => s.__typename === "FeaturesCardsComponent",
        ) ?? -1;

        return (
          <>
            <PageView ingestKey={generalEvents.ingestKey} />
            {sections?.map((section, index) => {
              const isFirstFeatures = isHome && index === firstFeaturesIndex;
              return (
                <Fragment key={section._id}>
                  {isFirstFeatures &&
                    section.__typename === "FeaturesCardsComponent" && (
                      <div id="features-cards-duplicate">
                        <FeaturesList
                          heading={{
                            ...section.heading,
                            tag: "Problem",
                            subtitle:
                              "Healthcare systems in emerging markets are still fragmented and paper-driven",
                          }}
                          featuresCardsList={{
                            items: section.featuresCardsList.items
                              .slice(0, 1)
                              .map((item, index) =>
                                index === 0
                                  ? {
                                      ...item,
                                      image: {
                                        dark: {
                                          url: "/images/healthcare-records.png",
                                          alt: "Primary healthcare centre records room with paper-based filing",
                                          height: 374,
                                          width: 560,
                                        },
                                        light: {
                                          url: "/images/healthcare-records.png",
                                          alt: "Primary healthcare centre records room with paper-based filing",
                                          height: 374,
                                          width: 560,
                                        },
                                      },
                                    }
                                  : item,
                              ),
                          }}
                          mainTitleOverride="Africa's Healthcare Crisis:"
                          cardFramed={false}
                          hideDescriptions
                          firstCardTitleOverride="Fragmented Systems, Paper Chaos, and Inaccessible Care"
                          firstCardCharacteristicsOverride={[
                            { _title: "Hospitals still operate on paper records." },
                            { _title: "Patient histories are locked in physical files." },
                            { _title: "Digital systems are siloed and incompatible." },
                            { _title: "Patients cannot carry their medical records between providers." },
                            { _title: "Insurance cannot properly assess risk due to incomplete data." },
                          ]}
                        />
                      </div>
                    )}
                  <div id={section._slug}>
                    {section.__typename === "FaqComponent" &&
                    section._slug === "faq" ? (
                      <Faq
                        {...section}
                        questions={{ items: FAQ_OVERRIDE_ITEMS }}
                      />
                    ) : section.__typename === "CalloutComponent" &&
                    section._slug === "callout" ? (
                      <Callout
                        {...section}
                        title="Our insight"
                        subtitle="AI in healthcare is impossible without clean, structured, interoperable data. Instead of building AI on top of broken systems, we are rebuilding the infrastructure layer first."
                        eventsKey={generalEvents.ingestKey}
                      />
                    ) : section.__typename === "FeaturesCardsComponent" &&
                      section._slug === "features-cards" ? (
                      <FeaturesList
                        {...section}
                        heading={{
                          ...section.heading,
                          tag: "Our Solution",
                          subtitle:
                            "Turning fragmented, paper‑based healthcare into a connected, data‑driven system.",
                        }}
                        mainTitleOverride="What we’re building to solve it"
                      />
                    ) : section.__typename === "FeaturesGridComponent" &&
                      section._slug === "features-grid" ? (
                      <FeaturesGrid
                        {...section}
                        eventsKey={generalEvents.ingestKey}
                        useWhyNowContent
                      />
                    ) : section.__typename ===
                        "FeaturesSideBySideComponent" &&
                      section._slug === "features-side-by-side" ? (
                      <SideFeatures
                        {...section}
                        eventsKey={generalEvents.ingestKey}
                        useOurAdvantageContent
                      />
                    ) : section.__typename ===
                      "FeaturesBigImageComponent" ? (
                      <BigFeature
                        {...section}
                        heading={{
                          ...section.heading,
                          tag: "Long term vision",
                          title: "The Future Layer of Healthcare Infrastructure",
                          subtitle:
                            "We are building the foundation layer for AI driven healthcare in emerging markets.",
                        }}
                        featuresBigImageList={{
                          items: (() => {
                            const defaultIcon =
                              section.featuresBigImageList.items[0]?.icon ?? {
                                alt: "",
                                url: "",
                              };
                            return [
                              {
                                _title: "Consent Governed Health Data Exchange",
                                description:
                                  "Secure, permission based data sharing across hospitals, insurers, and patients.",
                                icon: defaultIcon,
                                iconKey: "lock",
                              },
                              {
                                _title: "Federated Learning Across Hospital Networks",
                                description:
                                  "Shared AI model improvement without exposing raw patient data.",
                                icon: defaultIcon,
                                iconKey: "share",
                              },
                              {
                                _title: "AI Ready Structured APIs",
                                description:
                                  "Clean, standardized health data that developers and partners can build on.",
                                icon: defaultIcon,
                                iconKey: "code",
                              },
                              {
                                _title: "Population Level Health Risk Modeling",
                                description:
                                  "Anonymized insights to help providers and insurers understand trends and prevent disease earlier.",
                                icon: defaultIcon,
                                iconKey: "chart",
                              },
                            ];
                          })(),
                        }}
                      />
                    ) : section.__typename === "FormComponent" &&
                      section._slug === "request-a-demo-form" ? (
                      <Form
                        {...section}
                        title="Request a demo with the Healumin8 team"
                      />
                    ) : (
                      <SectionsUnion
                        comp={section}
                        eventsKey={generalEvents.ingestKey}
                      />
                    )}
                  </div>
                </Fragment>
              );
            })}
          </>
        );
      }}
    </Pump>
  );
}
