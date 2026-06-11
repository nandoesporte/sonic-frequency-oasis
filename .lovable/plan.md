## Plano: Frequência "Saúde Corporal" em destaque no Dashboard

### 1. Banco de dados
- **Migração** (`supabase--migration`):
  - Adicionar coluna `audio_url TEXT NULL` em `public.frequencies`.
- **Insert** (após migração):
  - Inserir nova linha em `frequencies`:
    - `name`: "Saúde Corporal"
    - `hz`: 528 (Solfeggio associada à regeneração corporal — confirme se prefere outro valor)
    - `category`: `physical` (Saúde Física — enum existente mais próximo de "Saúde Corporal")
    - `purpose`: "Regeneração e vitalidade corporal"
    - `description`: "Sessão guiada de 20 minutos para harmonização do corpo físico, equilíbrio energético e regeneração celular."
    - `is_premium`: `true`
    - `audio_url`: URL pública do MP3 hospedado no Storage (preenchida após upload).

### 2. Áudio no Supabase Storage
- Reutilizar o bucket **público** existente `sentimento-audios` (evita criar novo bucket).
- Script no sandbox para:
  1. Baixar `https://files.manuscdn.com/.../OiMtcZNozkpZBeEF.mp3` via `curl`.
  2. Upload no caminho `frequencias-destaque/saude-corporal.mp3` usando a service role key.
  3. Atualizar a linha inserida com a `public URL` do objeto.

### 3. Tipo `FrequencyData` e fetch
- `src/lib/data.ts`:
  - Adicionar `audioUrl?: string` ao tipo `FrequencyData`.
  - Mapear `freq.audio_url → audioUrl` em `getFrequenciesByCategory`, `getTrendingFrequencies`, `getFrequencyById`.
- Adicionar helper `getFeaturedFrequency()` que busca a frequência destaque (por nome ou flag).

### 4. Reprodução do MP3 (lógica de áudio)
- `src/lib/audio-context.tsx`, função `play()`:
  - Antes do fallback para oscilador, checar `if (frequency.audioUrl)` → tocar arquivo MP3 com `new Audio(frequency.audioUrl)` (com fade-in/out já existentes e `crossOrigin = "anonymous"`).
  - Manter Wake Lock, histórico e estado `isPlaying` consistentes com o fluxo atual.
  - Manter bloqueio premium existente (`frequency.premium && !hasAccess`) — sem alterações na regra de pagamento.

### 5. UI — Card de destaque no Dashboard
- Novo componente `DashboardFeaturedCard` em `src/components/home/DashboardCards.tsx`:
  - Visual grande, glass + gradient (alinhado ao landing): badge "Destaque", coroa Premium, duração "20 min", Hz, descrição curta, botão grande "Ouvir agora".
  - Reusa `usePremium().hasAccess`: usuários sem assinatura veem ícone `Lock` e ao clicar são redirecionados para `/premium#planos` (mesmo fluxo do `DashboardFrequencyCard`).
- `src/pages/Index.tsx`:
  - Logo após o "Dashboard Hero" (antes das Quick Actions), renderizar `<DashboardFeaturedCard frequency={featured} />` quando `featured` carregar.
  - Carregar via `getFeaturedFrequency()` no `useEffect`.

### 6. Verificação
- `bun run build`.
- Testar no preview logado: card de destaque aparece, clique em não-premium redireciona para planos, clique em premium toca o MP3 com fade.

### Notas técnicas
- Nenhuma alteração no fluxo de pagamento/Premium — apenas reuso do `PremiumContext` existente.
- Não criar bucket novo; reutilizar `sentimento-audios` (público).
- `audio_url` fica como coluna opcional em `frequencies`, então frequências antigas continuam usando oscilador.

Confirme o **Hz** desejado (proponho **528 Hz**) antes de eu executar — ou aprovo este plano e sigo com 528.