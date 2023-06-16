
export async function loadFonts () {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */'webfontloader')

  webFontLoader.load({
    google: {
      families: ['Josefin Sans:100,300,400,500,700,900&display=swap', 'Roboto:100,300,400,500,700,900&display=swap'],
    },
  })
}
