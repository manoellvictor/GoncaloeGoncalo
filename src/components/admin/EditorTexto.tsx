"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState, type ReactNode } from "react";
import { enviarImagem, ErroImagem } from "./enviar-imagem";

/**
 * Editor do corpo do artigo (TipTap). Só oferece o que o site sabe exibir:
 * subtítulos H2/H3, negrito, itálico, listas, citação, link e imagem, mais
 * desfazer/refazer. Texto colado de fora perde o que não estiver nessa lista,
 * então nada quebra o layout. O HTML ainda é limpo no servidor ao salvar.
 */
export function EditorTexto({
  artigoId,
  valor,
  onChange,
  invalido,
  descricaoId,
}: {
  artigoId: string;
  valor: string;
  onChange: (html: string) => void;
  invalido?: boolean;
  descricaoId?: string;
}) {
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState<string | null>(null);
  const entradaImagem = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        underline: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto", "tel"],
        },
      }),
      Image.configure({ inline: false }),
    ],
    content: valor,
    editorProps: {
      attributes: {
        class:
          "artigo-corpo min-h-[22rem] px-4 py-4 focus:outline-none sm:px-6 [&_.is-editor-empty:first-child]:before:text-neutral-500",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Texto do artigo",
        ...(descricaoId ? { "aria-describedby": descricaoId } : {}),
        ...(invalido ? { "aria-invalid": "true" } : {}),
      },
    },
    onUpdate: ({ editor: atual }) => onChange(atual.isEmpty ? "" : atual.getHTML()),
  });

  const ativo = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            negrito: e.isActive("bold"),
            italico: e.isActive("italic"),
            lista: e.isActive("bulletList"),
            numerada: e.isActive("orderedList"),
            citacao: e.isActive("blockquote"),
            link: e.isActive("link"),
            podeDesfazer: e.can().undo(),
            podeRefazer: e.can().redo(),
          }
        : null,
  });

  function editarLink(e: Editor) {
    const atual = e.getAttributes("link").href as string | undefined;
    const resposta = window.prompt(
      "Cole o endereço do link (deixe em branco para remover):",
      atual ?? "https://",
    );
    if (resposta === null) return;
    const endereco = resposta.trim();
    if (!endereco || endereco === "https://") {
      e.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const href = /^(https?:|mailto:|tel:)/i.test(endereco) ? endereco : `https://${endereco}`;
    e.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  async function inserirImagem(arquivo: File | undefined) {
    if (!arquivo || !editor) return;
    const alt = window.prompt(
      "Descreva a imagem em poucas palavras (ajuda quem usa leitor de tela):",
      "",
    );
    if (alt === null) return;
    if (!alt.trim()) {
      setFalha("A imagem precisa de uma descrição. Tente de novo e descreva a imagem.");
      return;
    }
    setFalha(null);
    setEnviando(true);
    try {
      const src = await enviarImagem(arquivo, artigoId, "corpo");
      editor.chain().focus().setImage({ src, alt: alt.trim() }).run();
    } catch (erro) {
      setFalha(erro instanceof ErroImagem ? erro.message : "Não foi possível enviar a imagem.");
    } finally {
      setEnviando(false);
      if (entradaImagem.current) entradaImagem.current.value = "";
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-md border bg-white focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/30 ${
        invalido ? "border-red-700" : "border-border-light"
      }`}
    >
      <div
        role="toolbar"
        aria-label="Formatação do texto"
        className="flex flex-wrap gap-1 border-b border-border-light bg-cream-100 p-1.5"
      >
        <Botao
          rotulo="Subtítulo"
          ativo={ativo?.h2}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="font-display text-[0.9375rem] font-semibold">T1</span>
        </Botao>
        <Botao
          rotulo="Subtítulo menor"
          ativo={ativo?.h3}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <span className="font-display text-[0.8125rem] font-semibold">T2</span>
        </Botao>
        <Separador />
        <Botao
          rotulo="Negrito"
          ativo={ativo?.negrito}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <span className="font-bold">N</span>
        </Botao>
        <Botao
          rotulo="Itálico"
          ativo={ativo?.italico}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <span className="font-serif italic">I</span>
        </Botao>
        <Separador />
        <Botao
          rotulo="Lista com marcadores"
          ativo={ativo?.lista}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <Icone d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
        </Botao>
        <Botao
          rotulo="Lista numerada"
          ativo={ativo?.numerada}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <Icone d="M10 6h10M10 12h10M10 18h10M4 5l1.5-1v5M4 14.5a1.5 1.5 0 1 1 2.6 1L4 19h3" />
        </Botao>
        <Botao
          rotulo="Citação"
          ativo={ativo?.citacao}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Icone d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" />
        </Botao>
        <Separador />
        <Botao rotulo="Link" ativo={ativo?.link} onClick={() => editor && editarLink(editor)}>
          <Icone d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </Botao>
        <Botao
          rotulo={enviando ? "Enviando imagem…" : "Imagem"}
          disabled={enviando}
          onClick={() => entradaImagem.current?.click()}
        >
          <Icone d="M4 5h16v14H4zM4 15l4.5-4.5 4 4 2.5-2.5L20 17M15.5 9.5h.01" />
        </Botao>
        <Separador />
        <Botao
          rotulo="Desfazer"
          disabled={!ativo?.podeDesfazer}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Icone d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />
        </Botao>
        <Botao
          rotulo="Refazer"
          disabled={!ativo?.podeRefazer}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Icone d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />
        </Botao>
      </div>

      <input
        ref={entradaImagem}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(evento) => inserirImagem(evento.target.files?.[0])}
      />

      {falha ? (
        <p role="alert" className="border-b border-border-light bg-red-50 px-4 py-2 text-small font-semibold text-red-800">
          {falha}
        </p>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}

function Botao({
  rotulo,
  ativo,
  disabled,
  onClick,
  children,
}: {
  rotulo: string;
  ativo?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={rotulo}
      aria-label={rotulo}
      aria-pressed={ativo === undefined ? undefined : ativo}
      disabled={disabled}
      // Mantém a seleção do texto ao clicar no botão.
      onMouseDown={(evento) => evento.preventDefault()}
      onClick={onClick}
      className={`inline-flex size-10 items-center justify-center rounded text-primary-900 transition-colors duration-150 disabled:opacity-35 ${
        ativo ? "bg-primary-900 text-white" : "hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function Separador() {
  return <span aria-hidden="true" className="mx-0.5 my-1.5 w-px bg-border-light" />;
}

function Icone({ d }: { d: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
