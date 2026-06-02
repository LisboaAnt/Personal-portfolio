import { HeroBioMotion } from "@/components/home/HeroBioMotion";
import { HeroBioServer } from "@/components/home/HeroBioServer";

export async function HeroBio() {
  return (
    <HeroBioMotion>
      <HeroBioServer />
    </HeroBioMotion>
  );
}
