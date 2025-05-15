export const authStyles = {
  container: `
    min-h-screen 
    flex 
    items-center 
    justify-center 
    bg-gradient-to-r 
    from-indigo-500 
    via-purple-500 
    to-pink-500 
    py-12 
    px-4 
    sm:px-6 
    lg:px-8
  `,
  
  card: `
    bg-white 
    rounded-2xl 
    shadow-xl 
    w-full 
    max-w-md 
    p-8 
    space-y-8
  `,

  logo: `
    mx-auto 
    h-12 
    w-auto
  `,

  title: `
    mt-6 
    text-center 
    text-3xl 
    font-extrabold 
    text-gray-900
  `,

  subtitle: `
    mt-2 
    text-center 
    text-sm 
    text-gray-600
  `,

  form: `
    mt-8 
    space-y-6
  `,

  inputGroup: `
    -space-y-px 
    rounded-md 
    shadow-sm
  `,

  input: `
    appearance-none 
    relative 
    block 
    w-full 
    px-3 
    py-3 
    border 
    border-gray-300 
    placeholder-gray-500 
    text-gray-900 
    rounded-md 
    focus:outline-none 
    focus:ring-indigo-500 
    focus:border-indigo-500 
    focus:z-10 
    sm:text-sm
  `,

  button: `
    group 
    relative 
    w-full 
    flex 
    justify-center 
    py-3 
    px-4 
    border 
    border-transparent 
    text-sm 
    font-medium 
    rounded-md 
    text-white 
    bg-indigo-600 
    hover:bg-indigo-700 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    focus:ring-indigo-500
    transition-colors
    duration-200
  `,

  link: `
    font-medium 
    text-indigo-600 
    hover:text-indigo-500
    transition-colors
    duration-200
  `,

  errorMessage: `
    rounded-md 
    bg-red-50 
    p-4 
    mb-4
  `,

  successMessage: `
    rounded-md 
    bg-green-50 
    p-4 
    mb-4
  `,
} 