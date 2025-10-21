import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Card } from "../../components/ui/card";

export const DescriptionAccordion = ({
  description,
}: {
  description: string;
}) => {
  return (
    <Card className=" border-none">
      <Accordion
        type="single"
        collapsible
        className="w-full grid-cols-1 font-primary bg-primary-foreground rounded-lg  "
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-light">
            Description
          </AccordionTrigger>
          <AccordionContent className="font-extralight text-sm space-x-10 space-y-20">
            {description}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
