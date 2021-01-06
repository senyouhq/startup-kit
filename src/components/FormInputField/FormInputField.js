export default function FormInputField(props) {
  const { form, name, type, render, value } = props

  const renderProps = {
    type,
    name,
    value,
  }

  if (type === 'checkbox') {
    renderProps.checked = !!form.values[name]
    renderProps.onChange = ({ target }) => form.onChange(name, target.checked)
  } else if (type === 'radio') {
    renderProps.checked = form.values[name] === value
    renderProps.onChange = ({ target }) => form.onChange(name, value)
  } else {
    renderProps.value = form.values[name] || ''
    renderProps.onChange = ({ target }) => form.onChange(name, target.value)
  }

  return render(renderProps)
}
