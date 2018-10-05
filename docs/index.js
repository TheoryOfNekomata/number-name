(function Demo(window) {
  const converter = new window.NumberName()

  const [input, ] = window.document.getElementsByTagName('input')
  const [output, ] = window.document.getElementsByTagName('output')

  const DEFAULT_VALUE = '\xA0'

  input.addEventListener('input', (e) => {
    let numberName
    try {
      if (e.target.value.trim().length < 1) {
        numberName = DEFAULT_VALUE
      } else {
        numberName = converter.toName(e.target.value)
      }
    } catch (e) {
      numberName = DEFAULT_VALUE
    }
    output.innerText = numberName
  })
})(window)
