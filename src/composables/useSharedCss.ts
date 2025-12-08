export default function useSharedCss() {
  const adaptiveModalWrapperClasses = () => {
    return 'tn:flex tn:flex-col tn:items-center tn:justify-center tn:gap-6 tn:px-6 tn:pt-11 tn:pb-6 tn:text-center'
  }

  const adaptiveModalHeaderClasses = () => {
    return 'tn:tracking-tightest tn:mb-2 tn:text-2xl tn:font-semibold tn:lg:text-4xl tn:leading-7.5 tn:lg:leading-11.5'
  }

  const adaptiveModalSubheaderClasses = () => {
    return 'tn:text-tn-black-500 tn:text-sm tn:leading-5.5 tn:font-normal tn:lg:text-lg tn:lg:leading-7'
  }

  return {
    adaptiveModalWrapperClasses,
    adaptiveModalHeaderClasses,
    adaptiveModalSubheaderClasses
  }
}
