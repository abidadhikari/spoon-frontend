import Classic from "@/components/menu-templates/Classic";
import Elegant from "@/components/menu-templates/Elegant";

const menuTemplates = [
  {
    id: "classic",
    name: "Classic",
    template: Classic,
    thumbnail: "/templates/classic.png",
  },
  {
    id: "elegant",
    name: "Elegant",
    template: Elegant,
    thumbnail: "/templates/elegant.png",
  },
  {
    id: "big-boy",
    name: "Big Boy",
    template: () =>
      import("@/components/menu-templates/BigBoy").then((mod) => mod.default),
    thumbnail: "/templates/big-boy.png",
  },
] as const;

const getDefaultTemplate = () => {
  return menuTemplates[0];
};

export { menuTemplates, getDefaultTemplate };
