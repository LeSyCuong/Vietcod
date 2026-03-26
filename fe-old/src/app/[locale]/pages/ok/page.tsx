"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Terminal,
  Shield,
  Database,
  Server,
  Code2,
  Cpu,
  Globe,
  Layers,
  Box,
  Command,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Activity,
  Lock,
  Zap,
  Workflow,
  Play,
  Plus,
  Minus,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES & INTERFACES ---
interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colSpan?: number;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface TerminalCommand {
  cmd: string;
  output: React.ReactNode;
  delay: number;
}

// --- STATIC DATA ---
const NAV_LINKS: NavItem[] = [
  { label: "Sản phẩm", href: "#products" },
  { label: "Hạ tầng Edge", href: "#infrastructure" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "Khách hàng", href: "#clients" },
  { label: "Tài liệu", href: "#docs" },
];

const FEATURES_DATA: FeatureItem[] = [
  {
    id: "f1",
    title: "Global Edge Network",
    description:
      "Triển khai server game của bạn tại 35+ khu vực trên toàn thế giới chỉ với một lệnh CLI. Giảm độ trễ cho người chơi xuống dưới 20ms bất kể họ ở đâu.",
    icon: <Globe size={24} className="text-zinc-400" />,
    colSpan: 2,
  },
  {
    id: "f2",
    title: "Hardware Anti-DDoS",
    description:
      "Tích hợp sẵn bộ lọc L4/L7 chuyên biệt cho UDP/TCP packet của Game Server. Tự động drop traffic độc hại mà không làm tăng ping.",
    icon: <Shield size={24} className="text-zinc-400" />,
    colSpan: 1,
  },
  {
    id: "f3",
    title: "Zero-Downtime Updates",
    description:
      "Hệ thống Blue/Green deployment tự động. Cập nhật mã nguồn hoặc bảo trì database không làm gián đoạn trải nghiệm của người chơi đang online.",
    icon: <Activity size={24} className="text-zinc-400" />,
    colSpan: 1,
  },
  {
    id: "f4",
    title: "Mã Nguồn Cấp Doanh Nghiệp",
    description:
      "Source code được tối ưu hóa bộ nhớ, refactor toàn bộ backdoors, đính kèm document chi tiết và SDKs cho các ngôn ngữ phổ biến.",
    icon: <Code2 size={24} className="text-zinc-400" />,
    colSpan: 2,
  },
  {
    id: "f5",
    title: "Real-time Metrics",
    description:
      "Theo dõi CCU, CPU, RAM và Network Bandwidth với độ trễ chỉ 1 giây thông qua Dashboard hiện đại.",
    icon: <Zap size={24} className="text-zinc-400" />,
    colSpan: 1,
  },
  {
    id: "f6",
    title: "Distributed Database",
    description:
      "Tự động sharding và backup dữ liệu người chơi. Cam kết an toàn dữ liệu tuyệt đối ngay cả khi server vật lý gặp sự cố.",
    icon: <Database size={24} className="text-zinc-400" />,
    colSpan: 2,
  },
];

const PRICING_DATA: PricingPlan[] = [
  {
    id: "dev",
    name: "Developer",
    price: "$0",
    billingPeriod: "mãi mãi",
    description: "Dành cho cá nhân thử nghiệm và phát triển local.",
    features: [
      "1 Dự án giới hạn",
      "Shared CPU / 2GB RAM",
      "Community Support",
      "Truy cập Source Code cơ bản",
      "Max 50 CCU",
    ],
    ctaText: "Bắt đầu miễn phí",
  },
  {
    id: "pro",
    name: "Production",
    price: "$199",
    billingPeriod: "/ tháng",
    description: "Dành cho các dự án chuẩn bị vận hành chính thức.",
    features: [
      "Không giới hạn dự án",
      "8 vCPU / 16GB RAM / NVMe",
      "Priority Email Support",
      "Truy cập Full Source Code Pro",
      "Hardware Anti-DDoS 500Gbps",
      "Auto-scaling lên đến 5000 CCU",
    ],
    isPopular: true,
    ctaText: "Nâng cấp Production",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    billingPeriod: "",
    description: "Giải pháp toàn diện cho các nhà phát hành lớn.",
    features: [
      "Private Cloud Infrastructure",
      "Bare Metal Servers tùy chọn",
      "Hỗ trợ 1-1 qua Slack 24/7",
      "Custom Source Code theo yêu cầu",
      "SLA 99.99% Uptime",
      "Dedicated Account Manager",
    ],
    ctaText: "Liên hệ Sales",
  },
];

const FAQS_DATA: FAQItem[] = [
  {
    question: "Hệ thống hỗ trợ những loại Source Game nào?",
    answer:
      "Chúng tôi hỗ trợ đa dạng các nền tảng: từ PC Games (MMORPG cổ điển), Mobile Games (Unity, Unreal Engine), cho đến Web/H5 Games. Mỗi source đều đi kèm với Server Architecture tương ứng được tối ưu sẵn.",
  },
  {
    question: "Khả năng chống DDoS của nền tảng hoạt động ra sao?",
    answer:
      "Khác với web firewall thông thường, chúng tôi sử dụng phần cứng phân tích gói tin chuyên sâu (Deep Packet Inspection) tối ưu riêng cho giao thức UDP của game. Nó tự động nhận diện và loại bỏ traffic tấn công trong vòng 3 giây mà không ảnh hưởng đến băng thông người chơi thực.",
  },
  {
    question: "Tôi có thể mua đứt Source Code và tự host không?",
    answer:
      "Có. Gói Enterprise cho phép bạn toàn quyền sở hữu mã nguồn (Full License) và tự do triển khai trên hạ tầng riêng của bạn. Tuy nhiên, chúng tôi khuyến nghị sử dụng GamePro Edge Network để đạt hiệu suất cao nhất.",
  },
  {
    question: "API và SDK tích hợp hỗ trợ ngôn ngữ nào?",
    answer:
      "Hệ thống quản trị cung cấp RESTful API đầy đủ. SDK hiện tại có sẵn cho TypeScript/Node.js, Go, Python và C#. Tài liệu API được sinh tự động theo chuẩn OpenAPI 3.0.",
  },
];

const TERMINAL_COMMANDS: TerminalCommand[] = [
  {
    cmd: "npm install -g @gamepro/cli",
    delay: 500,
    output: (
      <div className="text-zinc-500 mt-1 mb-3">
        added 42 packages, and audited 43 packages in 2s
      </div>
    ),
  },
  {
    cmd: "gamepro login",
    delay: 1000,
    output: (
      <div className="text-zinc-300 mt-1 mb-3">
        <span className="text-green-500">✔</span> Authenticated as
        cuong@fyntech.vn
      </div>
    ),
  },
  {
    cmd: "gamepro init mmo-server --region=ap-southeast-1",
    delay: 1500,
    output: (
      <div className="mt-1 mb-3 space-y-1">
        <div className="text-zinc-400">
          Initializing project <span className="text-zinc-200">mmo-server</span>
          ...
        </div>
        <div className="text-zinc-300">
          <span className="text-green-500">✔</span> Cloned enterprise repository
        </div>
        <div className="text-zinc-300">
          <span className="text-green-500">✔</span> Provisioned database cluster
        </div>
        <div className="text-zinc-300">
          <span className="text-green-500">✔</span> Configured Edge network
          (Singapore)
        </div>
      </div>
    ),
  },
  {
    cmd: "gamepro deploy --prod",
    delay: 2000,
    output: (
      <div className="mt-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="animate-spin text-zinc-500">⠋</span>
          <span className="text-zinc-400">Building container images...</span>
        </div>
        <div className="text-zinc-300">
          <span className="text-green-500">✔</span> Build successful (1.2s)
        </div>
        <div className="text-zinc-300">
          <span className="text-green-500">✔</span> Traffic routed to new
          instances
        </div>
        <div className="text-zinc-100 mt-2 bg-zinc-900 border border-zinc-800 p-2 rounded inline-block">
          Deployment live at:{" "}
          <a href="#" className="text-blue-400 hover:underline">
            https://api.gamepro.vn/mmo-server
          </a>
        </div>
      </div>
    ),
  },
];

// --- ANIMATION VARIANTS ---
const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// --- SHARED COMPONENTS ---

const BackgroundGrid = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]">
    <svg
      className="absolute inset-0 h-full w-full stroke-zinc-800/20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M.5 40V.5H40" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
);

const SectionHeading = ({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) => (
  <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 z-10 relative">
    {badge && (
      <motion.div
        variants={FADE_UP}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-6"
      >
        <Zap size={12} className="text-zinc-500" />
        {badge}
      </motion.div>
    )}
    <motion.h2
      variants={FADE_UP}
      className="text-4xl md:text-5xl font-semibold text-zinc-100 tracking-tight mb-6"
    >
      {title}
    </motion.h2>
    <motion.p
      variants={FADE_UP}
      className="text-lg text-zinc-400 leading-relaxed"
    >
      {description}
    </motion.p>
  </div>
);

// --- MAIN SECTIONS ---

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-zinc-800/50 py-3"
          : "bg-transparent border-transparent py-5",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center group-hover:bg-white transition-colors">
            <Box size={18} className="text-black" />
          </div>
          <span className="text-zinc-100 font-semibold text-lg tracking-tight">
            GamePro
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Đăng nhập
          </a>
          <button className="h-9 px-4 rounded-md bg-zinc-100 text-black font-medium text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            Bắt đầu
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-black">
      <BackgroundGrid />

      {/* Dynamic Glow */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={STAGGER_CONTAINER}
        className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center"
      >
        <motion.a
          variants={FADE_UP}
          href="#changelog"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-xs font-medium mb-10 hover:bg-zinc-800 transition-colors backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
          GamePro Architecture V2.0 Available
          <ArrowRight size={12} className="text-zinc-500" />
        </motion.a>

        <motion.h1
          variants={FADE_UP}
          className="text-6xl sm:text-7xl md:text-8xl font-medium text-zinc-100 tracking-tighter mb-8 leading-[1.05]"
        >
          Hạ tầng trò chơi <br />
          <span className="text-zinc-600">chuẩn mực kỹ thuật.</span>
        </motion.h1>

        <motion.p
          variants={FADE_UP}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed font-normal"
        >
          Nền tảng Infrastructure-as-a-Service thiết kế dành riêng cho Game.
          Cung cấp mã nguồn sạch, API quản trị mạnh mẽ và mạng lưới máy chủ Edge
          độ trễ cực thấp.
        </motion.p>

        <motion.div
          variants={FADE_UP}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button className="h-12 px-8 rounded-lg bg-zinc-100 text-black font-medium text-base hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center w-full sm:w-auto">
            Khởi tạo Server ngay
          </button>
          <button className="h-12 px-8 rounded-lg bg-transparent text-zinc-300 border border-zinc-800 font-medium text-base hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
            <Command size={16} />
            Đọc Document
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const InteractiveTerminal = () => {
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;

    let isMounted = true;

    const runTerminal = async () => {
      for (let i = 0; i < TERMINAL_COMMANDS.length; i++) {
        if (!isMounted) break;
        setIsTyping(true);
        // Simulate typing delay
        await new Promise((r) => setTimeout(r, 600));
        setIsTyping(false);
        setStep(i + 1);
        // Wait for command output delay before next command
        await new Promise((r) => setTimeout(r, TERMINAL_COMMANDS[i].delay));
      }
    };

    runTerminal();
    return () => {
      isMounted = false;
    };
  }, [inView]);

  return (
    <section ref={ref} className="py-20 px-6 bg-black relative z-10 -mt-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-[#0c0c0c] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-[#111]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
            </div>
            <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
              <Terminal size={12} /> root@gamepro-edge
            </div>
            <div className="w-12"></div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8 font-mono text-sm min-h-[350px]">
            {TERMINAL_COMMANDS.slice(0, step).map((cmd, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex items-center text-zinc-100">
                  <span className="text-zinc-600 mr-3">~</span>
                  <span className="text-zinc-500 mr-2">$</span>
                  <span>{cmd.cmd}</span>
                </div>
                {cmd.output}
              </div>
            ))}

            {step < TERMINAL_COMMANDS.length && isTyping && (
              <div className="flex items-center text-zinc-400">
                <span className="text-zinc-600 mr-3">~</span>
                <span className="text-zinc-500 mr-2">$</span>
                <span className="w-2 h-4 bg-zinc-400 animate-pulse ml-1" />
              </div>
            )}

            {step === TERMINAL_COMMANDS.length && (
              <div className="flex items-center text-zinc-400 mt-4">
                <span className="text-zinc-600 mr-3">~</span>
                <span className="text-zinc-500 mr-2">$</span>
                <span className="w-2 h-4 bg-zinc-400 animate-pulse ml-1" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const Logos = () => {
  return (
    <section
      id="clients"
      className="py-20 border-y border-zinc-900 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
          Được tin dùng bởi các studio game hàng đầu
        </p>
      </div>
      <div className="flex whitespace-nowrap overflow-hidden relative w-full [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          className="flex gap-20 items-center px-10 opacity-40 grayscale hover:grayscale-0 transition-all"
        >
          {/* Duplicating array for infinite scroll effect */}
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="text-2xl font-bold font-sans tracking-tighter flex items-center gap-2">
                <Globe /> Vercel
              </div>
              <div className="text-2xl font-bold font-sans tracking-tighter flex items-center gap-2">
                <Workflow /> Linear
              </div>
              <div className="text-2xl font-bold font-sans tracking-tighter flex items-center gap-2">
                <Command /> Raycast
              </div>
              <div className="text-2xl font-bold font-sans tracking-tighter flex items-center gap-2">
                <Zap /> Supabase
              </div>
              <div className="text-2xl font-bold font-sans tracking-tighter flex items-center gap-2">
                <Layers /> Resend
              </div>
              <div className="text-2xl font-bold font-sans tracking-tighter flex items-center gap-2">
                <Lock /> Clerk
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const BentoFeatures = () => {
  return (
    <section id="products" className="py-32 px-6 bg-black relative">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={STAGGER_CONTAINER}
        className="max-w-7xl mx-auto"
      >
        <SectionHeading
          badge="KIẾN TRÚC"
          title="Xây dựng trên nền tảng vững chắc."
          description="Mọi thành phần của GamePro đều được thiết kế từ con số không để phục vụ một mục đích duy nhất: Hiệu suất tối đa cho trò chơi của bạn."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4">
          {FEATURES_DATA.map((feature) => (
            <motion.div
              key={feature.id}
              variants={FADE_UP}
              className={cn(
                "group relative p-8 rounded-3xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden flex flex-col justify-between",
                feature.colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
              )}
            >
              {/* Internal subtle gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/0 to-zinc-800/0 group-hover:from-zinc-800/10 group-hover:to-transparent transition-all duration-500" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center mb-6 text-zinc-400 group-hover:text-zinc-100 group-hover:scale-110 transition-all duration-300 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-zinc-100 mb-3 tracking-tight">
                  {feature.title}
                </h3>
              </div>

              <p className="text-zinc-500 text-sm leading-relaxed relative z-10 max-w-md group-hover:text-zinc-400 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const Metrics = () => {
  return (
    <section className="py-24 border-y border-zinc-900 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
        {[
          { label: "Uptime SLA", value: "99.99%" },
          { label: "Global Edge Locations", value: "35+" },
          { label: "Avg. Latency", value: "< 20ms" },
          { label: "Requests per second", value: "2.5M+" },
        ].map((metric, i) => (
          <div
            key={i}
            className="pt-8 md:pt-0 md:px-8 text-center flex flex-col items-center justify-center"
          >
            <h4 className="text-4xl font-medium text-zinc-100 tracking-tighter mb-2">
              {metric.value}
            </h4>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          badge="BẢNG GIÁ"
          title="Minh bạch, không phụ phí."
          description="Bắt đầu miễn phí và mở rộng quy mô một cách dễ dàng khi dự án của bạn phát triển."
        />

        <div className="flex justify-center mb-16">
          <div className="bg-zinc-900 p-1 rounded-lg inline-flex items-center border border-zinc-800">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-6 py-2.5 rounded-md text-sm font-medium transition-all",
                !isAnnual
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200",
              )}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-6 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                isAnnual
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200",
              )}
            >
              Hàng năm{" "}
              <span className="text-[10px] bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
                Giảm 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PRICING_DATA.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative p-8 rounded-3xl border flex flex-col",
                plan.isPopular
                  ? "border-zinc-500 bg-zinc-900/80 shadow-2xl shadow-zinc-900/50"
                  : "border-zinc-800 bg-zinc-950/50",
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-100 text-black px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
                  Khuyên dùng
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-medium text-zinc-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-zinc-500 h-10">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-medium text-zinc-100 tracking-tighter">
                  {plan.price === "Custom"
                    ? "Custom"
                    : isAnnual && plan.price !== "$0"
                      ? `$${parseInt(plan.price.replace("$", "")) * 0.8}`
                      : plan.price}
                </span>
                <span className="text-zinc-500 font-medium">
                  {plan.billingPeriod}
                </span>
              </div>

              <button
                className={cn(
                  "w-full h-12 rounded-xl text-sm font-medium transition-all mb-8 flex items-center justify-center gap-2",
                  plan.isPopular
                    ? "bg-zinc-100 text-black hover:bg-white"
                    : "bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800",
                )}
              >
                {plan.ctaText}
              </button>

              <div className="space-y-4 flex-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">
                  Bao gồm các tính năng:
                </p>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-zinc-600 shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 px-6 bg-black border-t border-zinc-900">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          title="Câu hỏi thường gặp"
          description="Mọi thứ bạn cần biết về nền tảng và cách thức hoạt động."
        />

        <div className="space-y-4">
          {FAQS_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-zinc-800 bg-zinc-950/50 rounded-2xl overflow-hidden transition-colors hover:bg-zinc-900/50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-zinc-100 font-medium pr-8">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center shrink-0 transition-transform duration-300",
                      isOpen ? "rotate-180 bg-zinc-800" : "",
                    )}
                  >
                    <ChevronDown size={14} className="text-zinc-400" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Dynamic CTA Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-zinc-800/20 via-zinc-700/20 to-zinc-800/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-12 md:p-20 rounded-[3rem] shadow-2xl">
        <Box size={40} className="text-zinc-100 mx-auto mb-8" />
        <h2 className="text-4xl md:text-5xl font-medium text-zinc-100 tracking-tight mb-6">
          Sẵn sàng để bắt đầu?
        </h2>
        <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
          Tham gia cùng hàng nghìn nhà phát triển đang xây dựng hệ thống game
          thế hệ mới trên nền tảng GamePro.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="h-12 px-8 rounded-xl bg-zinc-100 text-black font-medium text-base hover:bg-white transition-colors w-full sm:w-auto">
            Tạo tài khoản miễn phí
          </button>
          <button className="h-12 px-8 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-medium text-base hover:bg-zinc-800 transition-colors w-full sm:w-auto">
            Liên hệ Sales
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#050505] pt-24 pb-12 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-12 mb-20">
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center">
              <Box size={18} className="text-black" />
            </div>
            <span className="text-zinc-100 font-semibold text-xl tracking-tight">
              GamePro
            </span>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs mb-8 leading-relaxed">
            Hạ tầng quản lý và vận hành server game toàn diện. Thiết kế chuẩn
            mức kỹ thuật cao nhất cho Developers.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
            >
              <Github size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="text-zinc-100 text-sm font-semibold mb-6">Sản phẩm</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Kho Source Code
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Edge Computing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Database Cluster
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Web Admin Portal
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Bảng giá
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="text-zinc-100 text-sm font-semibold mb-6">
            Tài nguyên
          </h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Tài liệu API
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                SDK & CLI
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Hướng dẫn triển khai
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Status (100% Uptime)
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Blog Kỹ Thuật
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-2">
          <h4 className="text-zinc-100 text-sm font-semibold mb-6">
            Đăng ký nhận tin
          </h4>
          <p className="text-zinc-500 text-sm mb-4">
            Nhận thông báo về các bản cập nhật source code và tính năng hạ tầng
            mới nhất.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm rounded-lg px-4 py-2.5 w-full focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <button className="bg-zinc-100 text-black px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-900 text-xs text-zinc-600 font-medium">
        <p>
          © {new Date().getFullYear()} GamePro Architecture. All rights
          reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-zinc-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-zinc-400 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-zinc-400 transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      <Header />
      <main>
        <Hero />
        <InteractiveTerminal />
        <Logos />
        <BentoFeatures />
        <Metrics />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
