import LayoutContainer from "./LayoutContainer";

const SectionHeading = ({ eyebrow, title, description, action, align = "between", badge }) => {
  const centered = align === "center";

  return (
    <LayoutContainer size="wide">
      <div className={`flex gap-6 ${centered ? "flex-col items-center text-center" : "flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"}`}>
        <div className={centered ? "max-w-2xl" : "max-w-xl"}>
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
              {eyebrow}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
            {badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fef08a] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#713f12] border border-[#fde047]">
                {badge}
              </span>
            )}
          </div>
          {description && <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>}
        </div>
        {!centered && action}
      </div>
    </LayoutContainer>
  );
};

export default SectionHeading;
