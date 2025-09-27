import { InputSection } from "@/components/InputSection";
import { OutputSection } from "@/components/OutputSection";

export const TranslationContainer = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <InputSection />
          <OutputSection />
        </div>
      </div>
    </section>
  );
};