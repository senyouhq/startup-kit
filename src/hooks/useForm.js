import * as React from 'react'

export default function ({ schema }) {
  const [values, setValues] = React.useState({})
  const [isValid, setIsValid] = React.useState({})
  const [isDirty, setIsDirty] = React.useState(false)
  const [errors, setErrors] = React.useState()
  const [validatedValues, setValidatedValues] = React.useState({})
  const [focusAt, setFocusAt] = React.useState('')

  React.useEffect(() => {
    if (!schema) {
      return
    }

    if (!isDirty) {
      return
    }

    let validateErrors
    const { error, value } = schema.validate(values, {
      abortEarly: false,
      allowUnknown: true,
      convert: true,
    })

    if (error) {
      validateErrors = {}
      error.details.forEach((err) => {
        validateErrors[err.path[0]] = err.message
      })
    }

    setValidatedValues(value)
    setErrors(validateErrors)
    setIsValid(!validateErrors)
  }, [schema, values])

  const setInitialValues = (initialValues) => {
    setValues({ ...initialValues })
  }

  const validate = React.useCallback(() => {
    if (!schema) {
      throw Error('No schema for validate')
    }

    let validateErrors
    const { error, value } = schema.validate(values, {
      abortEarly: false,
      allowUnknown: true,
      convert: true,
    })

    if (error) {
      validateErrors = {}
      error.details.forEach((err) => {
        validateErrors[err.path[0]] = err.message
      })
    }

    setValidatedValues(value)
    setErrors(validateErrors)
    setIsValid(!validateErrors)

    return { errors: validateErrors, values: value }
  }, [schema, values])

  const onChange = React.useCallback(
    (name, value) => {
      setIsDirty(true)
      setValues({ ...values, [name]: value })
    },
    [values]
  )

  const onFocus = (name) => () => {
    setFocusAt(name)
  }

  const onBlur = () => {
    setFocusAt('')
  }

  return {
    onChange,
    onFocus,
    onBlur,
    focusAt,
    setInitialValues,
    validate,
    values,
    validatedValues,
    errors,
    isDirty,
    isValid,
  }
}
