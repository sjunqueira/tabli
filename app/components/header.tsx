export function Header() {
  return (
    <header className="w-full flex items-center justify-between p-4 max-w-5xl mx-auto">
      <h1 className="text-[#8b8b8b] text-xs font-bold tracking-widest uppercase select-none">
        <span className="text-white">tabli</span>
      </h1>
      
      <a 
        href="https://github.com/sjunqueira/tabli" 
        className="text-[#8b8b8b] text-xs hover:text-white transition-colors"
      >
        GitHub
      </a>
    </header>
  );
}