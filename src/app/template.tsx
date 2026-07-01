export default function Template({ children }: { children: React.ReactNode }) {
  // roda a cada navegação (o template re-monta), então a animação de entrada
  // se repete toda vez que muda de página
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {children}
    </div>
  );
}
