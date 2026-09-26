/** Fixed, decorative gradient glows behind all page content. */
export default function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-drift absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-400/25 blur-3xl dark:bg-indigo-600/20" />
      <div className="animate-drift absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-400/20 blur-3xl [animation-delay:-7s] dark:bg-violet-700/20" />
      <div className="animate-drift absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-pink-300/20 blur-3xl [animation-delay:-14s] dark:bg-pink-700/10" />
    </div>
  );
}
