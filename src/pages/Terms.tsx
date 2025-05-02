
import React from "react";
import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Terms() {
  const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="space-y-8">
          {/* Terms of Use Section */}
          <section className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              🧾 Termos de Uso
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {today}
            </p>
            
            <div className="space-y-4 text-sm md:text-base">
              <p>
                Este site e aplicativo são operados por Kefér Soluções Tecnológicas Ltda - CNPJ: 14.164.334/0001-05, 
                doravante denominada "Plataforma". Ao acessar ou utilizar nossos serviços, você concorda integralmente 
                com os termos a seguir. Leia com atenção antes de continuar.
              </p>
              
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-semibold">1. Natureza Informativa e Não Substitutiva</h2>
                <p>
                  As frequências sonoras disponibilizadas têm caráter informativo e complementar, sem qualquer finalidade 
                  de substituir tratamentos médicos, psicológicos ou terapêuticos convencionais. A Plataforma não garante 
                  qualquer resultado específico e não se responsabiliza por decisões pessoais baseadas no uso do conteúdo.
                </p>
                
                <h2 className="text-lg md:text-xl font-semibold">2. Isenção de Responsabilidade</h2>
                <p>Ao utilizar este site, o usuário compreende e aceita que:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>O uso das frequências ocorre por conta e risco exclusivo do usuário;</li>
                  <li>
                    A Plataforma não se responsabiliza por quaisquer danos diretos, indiretos, acidentais ou consequentes, 
                    incluindo, mas não se limitando a, desconforto físico, efeitos emocionais ou decisões baseadas na 
                    experiência individual;
                  </li>
                  <li>
                    Nenhuma informação fornecida aqui deve ser interpretada como aconselhamento médico, psicológico ou legal.
                  </li>
                </ul>
                
                <h2 className="text-lg md:text-xl font-semibold">3. Direitos Autorais e Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo, incluindo textos, frequências, interfaces, áudios, marca e identidade visual, são de 
                  propriedade da Plataforma ou de seus licenciadores e são protegidos por leis nacionais e internacionais. 
                  O uso não autorizado é estritamente proibido.
                </p>
                
                <h2 className="text-lg md:text-xl font-semibold">4. Modificações dos Termos</h2>
                <p>
                  A Plataforma pode atualizar estes Termos a qualquer momento, com ou sem aviso prévio. É responsabilidade 
                  do usuário revisá-los periodicamente.
                </p>
                
                <h2 className="text-lg md:text-xl font-semibold">5. Jurisdição e Foro</h2>
                <p>
                  Este contrato é regido pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de 
                  Maringá - PR para dirimir quaisquer controvérsias oriundas deste instrumento, com renúncia expressa de 
                  qualquer outro.
                </p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8" />
          
          {/* Privacy Policy Section */}
          <section className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              🔐 Política de Privacidade
            </h1>
            
            <div className="space-y-4 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold">1. Coleta de Dados</h2>
              <p>
                Coletamos dados como nome, e-mail, telefone, IP e interações de uso apenas para fins operacionais, 
                de melhoria contínua e atendimento.
              </p>
              
              <h2 className="text-lg md:text-xl font-semibold">2. Finalidade e Tratamento</h2>
              <p>Os dados coletados serão utilizados exclusivamente para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer acesso à plataforma;</li>
                <li>Enviar informações ou notificações, caso autorizado;</li>
                <li>Melhorar os serviços e identificar padrões de uso.</li>
              </ul>
              
              <h2 className="text-lg md:text-xl font-semibold">3. Compartilhamento com Terceiros</h2>
              <p>
                Não comercializamos, alugamos ou compartilhamos seus dados com terceiros, exceto quando exigido por lei 
                ou mediante autorização expressa do usuário.
              </p>
              
              <h2 className="text-lg md:text-xl font-semibold">4. Segurança</h2>
              <p>
                Empregamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, 
                perda, alteração ou destruição.
              </p>
              
              <h2 className="text-lg md:text-xl font-semibold">5. Direitos do Titular</h2>
              <p>
                Você tem direito de solicitar, a qualquer momento, a confirmação da existência de tratamento de seus dados, 
                acesso, correção, exclusão ou anonimização, conforme a LGPD.
              </p>
              
              <h2 className="text-lg md:text-xl font-semibold">6. Cookies</h2>
              <p>
                Utilizamos cookies estritamente necessários para o funcionamento da plataforma. Você pode desativá-los nas 
                configurações do navegador, embora isso possa limitar funcionalidades.
              </p>
              
              <h2 className="text-lg md:text-xl font-semibold">7. Encarregado pelo Tratamento de Dados</h2>
              <p>
                Qualquer solicitação referente aos dados pessoais pode ser feita pelo e-mail: contato@kefersolucoes.com.br.
              </p>
            </div>
          </section>
          
          {/* Contact Information */}
          <section className="mt-8 pt-4 border-t border-border">
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Endereço Comercial:</h3>
              <p>Avenida Doutor Luiz Teixeira Mendes, 3096 - Zona 05, Maringá - PR, CEP 87015-001</p>
              <p className="mt-2">
                <strong>Contato:</strong>{" "}
                <a href="mailto:contato@kefersolucoes.com.br" className="text-primary hover:underline">
                  contato@kefersolucoes.com.br
                </a>{" "}
                | WhatsApp:{" "}
                <a href="https://wa.me/5544997270698" className="text-primary hover:underline">
                  (44) 99727-0698
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
