"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as RechartsPrimitive from "recharts";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-slate-200/80 bg-white/90 text-slate-900 shadow-sm shadow-slate-200/60 backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Chart related components and types
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-slate-400 [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-slate-200/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-300 flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// โ”€โ”€ PyStep Hub Platform Stats Data โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€
const data = [
  { date: "Nov 24", learners: 320, lessons: 1840, xp: 51200 },
  { date: "Nov 25", learners: 395, lessons: 2310, xp: 63800 },
  { date: "Nov 26", learners: 430, lessons: 2640, xp: 72100 },
  { date: "Nov 27", learners: 480, lessons: 2980, xp: 84500 },
  { date: "Nov 28", learners: 445, lessons: 2750, xp: 79200 },
  { date: "Nov 29", learners: 510, lessons: 3120, xp: 91400 },
  { date: "Nov 30", learners: 570, lessons: 3480, xp: 105600 },
  { date: "Dec 01", learners: 620, lessons: 3840, xp: 118900 },
  { date: "Dec 02", learners: 595, lessons: 3650, xp: 113200 },
  { date: "Dec 03", learners: 680, lessons: 4200, xp: 128700 },
  { date: "Dec 04", learners: 740, lessons: 4580, xp: 142300 },
  { date: "Dec 05", learners: 790, lessons: 4920, xp: 155800 },
  { date: "Dec 06", learners: 760, lessons: 4710, xp: 149100 },
  { date: "Dec 07", learners: 830, lessons: 5160, xp: 163400 },
  { date: "Dec 08", learners: 920, lessons: 5720, xp: 181600 },
];

// Match PyStep Hub brand palette: emerald โ’ blue โ’ violet
const summary = [
  {
    name: "Active Learners",
    label: "เธเธนเนเน€เธฃเธตเธขเธเธ—เธตเนเนเธเนเธเธฒเธเธญเธขเธนเน",
    value: "920",
    unit: "users",
    change: "+150",
    percentageChange: "+19.5%",
    changeType: "positive" as const,
    dataKey: "learners",
    color: "hsl(158 64% 40%)",
    gradientFrom: "hsl(160 84% 39%)",
    gradientTo: "hsl(158 64% 40%)",
    badgeBg: "bg-emerald-100 text-emerald-800",
    valueCls: "text-emerald-600",
  },
  {
    name: "Lessons Completed",
    label: "เธเธ—เน€เธฃเธตเธขเธเธ—เธตเนเธเนเธฒเธเนเธฅเนเธง",
    value: "5,720",
    unit: "lessons",
    change: "+560",
    percentageChange: "+10.9%",
    changeType: "positive" as const,
    dataKey: "lessons",
    color: "hsl(213 94% 52%)",
    gradientFrom: "hsl(213 94% 52%)",
    gradientTo: "hsl(224 76% 48%)",
    badgeBg: "bg-blue-100 text-blue-800",
    valueCls: "text-blue-600",
  },
  {
    name: "XP Earned",
    label: "เธเธฐเนเธเธเธเธฃเธฐเธชเธเธเธฒเธฃเธ“เนเธฃเธงเธก",
    value: "181,600",
    unit: "XP",
    change: "+18,200",
    percentageChange: "+11.1%",
    changeType: "positive" as const,
    dataKey: "xp",
    color: "hsl(262 80% 58%)",
    gradientFrom: "hsl(262 80% 58%)",
    gradientTo: "hsl(270 76% 50%)",
    badgeBg: "bg-violet-100 text-violet-800",
    valueCls: "text-violet-600",
  },
];

const sanitizeName = (name: string) =>
  name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "_").toLowerCase();

export default function Stats4() {
  return (
    <div className="w-full bg-slate-50 px-4 py-8">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <p className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">
            // PLATFORM_STATS
          </p>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            PyStep Hub โ€” Overview
          </h2>
        </div>
        <a
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          เธ”เธนเธเธ—เน€เธฃเธตเธขเธ
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Cards Grid */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3 max-w-5xl mx-auto">
        {summary.map((item) => {
          const sanitizedName = sanitizeName(item.name);
          const gradientId = `gradient-${sanitizedName}`;
          const isPositive = item.changeType === "positive";

          return (
            <Card key={item.name} className="p-0 overflow-hidden">
              {/* Top accent strip */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${item.gradientFrom}, ${item.gradientTo})`,
                }}
              />

              <CardContent className="p-5 pb-0">
                {/* Label row */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <dt className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                      {item.name}
                    </dt>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.label}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeBg}`}
                  >
                    {item.unit}
                  </span>
                </div>

                {/* Value + Change */}
                <div className="flex items-baseline justify-between mb-3">
                  <dd className={`text-2xl font-extrabold tracking-tight ${item.valueCls}`}>
                    {item.value}
                  </dd>
                  <dd className="flex items-center gap-1 text-xs font-semibold">
                    {isPositive ? (
                      <TrendingUp size={13} className="text-emerald-500" />
                    ) : (
                      <TrendingDown size={13} className="text-red-500" />
                    )}
                    <span className={isPositive ? "text-emerald-600" : "text-red-600"}>
                      {item.percentageChange}
                    </span>
                    <span className="text-slate-400">{item.change}</span>
                  </dd>
                </div>

                {/* Mini sparkline chart */}
                <div className="mt-1 h-14 overflow-hidden">
                  <ChartContainer
                    className="w-full h-full"
                    config={{
                      [item.dataKey]: {
                        label: item.name,
                        color: item.color,
                      },
                    }}
                  >
                    <RechartsPrimitive.AreaChart
                      data={data}
                      margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id={gradientId}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={item.color}
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor={item.color}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <RechartsPrimitive.XAxis dataKey="date" hide={true} />
                      <RechartsPrimitive.Area
                        dataKey={item.dataKey}
                        stroke={item.color}
                        fill={`url(#${gradientId})`}
                        fillOpacity={1}
                        strokeWidth={2}
                        type="monotone"
                        dot={false}
                      />
                    </RechartsPrimitive.AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </dl>
    </div>
  );
}
