import {
  Inter,
  Roboto,
  Playfair_Display,
  Lato,
  Poppins,
  Montserrat,
  Open_Sans,
  Source_Sans_3,
  Nunito,
  Raleway,
  Ubuntu,
  Merriweather,
  Work_Sans,
  Rubik,
  Oswald,
  Quicksand,
  Outfit,
  Noto_Sans,
  PT_Serif,
  Josefin_Sans,
  Mulish,
  Lobster,
  Dancing_Script,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
const montserrat = Montserrat({ subsets: ["latin"] });
const openSans = Open_Sans({ subsets: ["latin"] });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"] });
const nunito = Nunito({ subsets: ["latin"] });
const raleway = Raleway({ subsets: ["latin"] });
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const merriweather = Merriweather({ subsets: ["latin"] });
const workSans = Work_Sans({ subsets: ["latin"] });
const rubik = Rubik({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"] });
const quicksand = Quicksand({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });
const notoSans = Noto_Sans({ subsets: ["latin"] });
const ptSerif = PT_Serif({ subsets: ["latin"], weight: ["400", "700"] });
const josefinSans = Josefin_Sans({ subsets: ["latin"] });
const mulish = Mulish({ subsets: ["latin"] });
const lobster = Lobster({ subsets: ["latin"], weight: "400" });
const dancingScript = Dancing_Script({ subsets: ["latin"] });

export const fontMap: Record<string, { className: string; name: string }> = {
  Arial: { className: "system-arial", name: "Arial, sans-serif" },
  "Times New Roman": {
    className: "system-times",
    name: "'Times New Roman', serif",
  },
  Helvetica: { className: "system-helvetica", name: "Helvetica, sans-serif" },
  Inter: { className: inter.className, name: "'Inter', sans-serif" },
  Roboto: { className: roboto.className, name: "'Roboto', sans-serif" },
  Playfair: {
    className: playfair.className,
    name: "'Playfair Display', serif",
  },
  Lato: { className: lato.className, name: "'Lato', sans-serif" },
  Poppins: { className: poppins.className, name: "'Poppins', sans-serif" },
  Montserrat: {
    className: montserrat.className,
    name: "'Montserrat', sans-serif",
  },
  OpenSans: { className: openSans.className, name: "'Open Sans', sans-serif" },
  SourceSans3: {
    className: sourceSans3.className,
    name: "'Source Sans 3', sans-serif",
  },
  Nunito: { className: nunito.className, name: "'Nunito', sans-serif" },
  Raleway: { className: raleway.className, name: "'Raleway', sans-serif" },
  Ubuntu: { className: ubuntu.className, name: "'Ubuntu', sans-serif" },
  Merriweather: {
    className: merriweather.className,
    name: "'Merriweather', serif",
  },
  WorkSans: { className: workSans.className, name: "'Work Sans', sans-serif" },
  Rubik: { className: rubik.className, name: "'Rubik', sans-serif" },
  Oswald: { className: oswald.className, name: "'Oswald', sans-serif" },
  Quicksand: {
    className: quicksand.className,
    name: "'Quicksand', sans-serif",
  },
  Outfit: { className: outfit.className, name: "'Outfit', sans-serif" },
  NotoSans: { className: notoSans.className, name: "'Noto Sans', sans-serif" },
  PTSerif: { className: ptSerif.className, name: "'PT Serif', serif" },
  JosefinSans: {
    className: josefinSans.className,
    name: "'Josefin Sans', sans-serif",
  },
  Mulish: { className: mulish.className, name: "'Mulish', sans-serif" },
  Lobster: { className: lobster.className, name: "'Lobster', cursive" },
  DancingScript: {
    className: dancingScript.className,
    name: "'Dancing Script', cursive",
  },
};
