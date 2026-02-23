export const authStyles = {
  container: `
    min-h-screen
    grid
    lg:grid-cols-[1fr_480px]
    bg-[linear-gradient(140deg,#fdfcf9_0%,#f3eee5_42%,#e9f0ff_100%)]
  `,

  heroPanel: `
    hidden
    lg:flex
    flex-col
    justify-between
    p-12
    xl:p-16
    border-r
    border-[color:var(--brand-line)]
  `,

  heroTitle: `
    text-5xl
    leading-tight
    text-balance
  `,

  heroSubtitle: `
    mt-5
    max-w-lg
    text-base
    leading-relaxed
    text-[color:var(--brand-muted)]
  `,

  heroMeta: `
    rounded-3xl
    border
    border-[color:var(--brand-line)]
    bg-white/70
    p-5
    text-sm
    text-[color:var(--brand-muted)]
  `,

  cardWrap: `
    flex
    items-center
    justify-center
    px-5
    py-10
    sm:px-8
    lg:px-10
  `,

  card: `
    w-full
    max-w-lg
    rounded-3xl
    border
    border-[color:var(--brand-line)]
    bg-white/92
    p-6
    shadow-[0_20px_50px_rgba(27,36,56,0.12)]
    backdrop-blur
    sm:p-8
  `,

  logo: `
    h-11
    w-auto
  `,

  title: `
    mt-4
    text-3xl
  `,

  subtitle: `
    mt-2
    text-sm
    text-[color:var(--brand-muted)]
  `,

  form: `
    mt-6
    space-y-5
  `,

  inputGroup: `
    space-y-4
  `,

  formField: `
    space-y-2
  `,

  label: `
    label
  `,

  input: `
    input-shell
  `,

  button: `
    button-primary
    w-full
  `,

  link: `
    font-semibold
    text-[color:var(--brand-accent)]
    hover:text-[#104ccb]
    ml-1
  `,

  errorMessage: `
    rounded-2xl
    border
    border-[#f2cccc]
    bg-[#fff3f3]
    px-4
    py-3
    text-sm
    text-[color:var(--brand-danger)]
  `,

  successMessage: `
    rounded-2xl
    border
    border-[#c9eddc]
    bg-[#f0fbf6]
    px-4
    py-3
    text-sm
    text-[color:var(--brand-success)]
  `,

  divider: `
    relative
    flex
    items-center
    justify-center
    py-1
  `,

  dividerLine: `
    absolute
    inset-x-0
    top-1/2
    border-t
    border-[color:var(--brand-line)]
  `,

  dividerText: `
    relative
    z-10
    bg-white
    px-3
    text-xs
    uppercase
    tracking-[0.14em]
    text-[color:var(--brand-muted)]
  `,
}
