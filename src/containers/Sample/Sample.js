import React from 'react'
import Joi from 'joi'

import useForm from 'hooks/useForm'
import Box from '@material-ui/core/Box'

import FormInputField from 'components/FormInputField'

import css from './styles.scss'

const schema = Joi.object({
  userName: Joi.string().min(3).max(15).trim().required(),
  gender: Joi.number().only().allow(1, 2).required(),
})

function Customers() {
  const form = useForm({ schema })
  const [errors, setErrors] = React.useState({})

  React.useEffect(() => {
    form.setInitialValues({
      userName: 'Ma ni',
      gender: 2,
      note: 'hello',
      occupation: 'teacher',
      married: false,
    })
  }, [])

  const handleSave = () => {
    // Call API here
    setErrors({})
    const { values, errors } = form.validate()

    if (errors) {
      setErrors(errors)
    }

    console.log('errors', errors)
    console.log('values', values)
  }

  return (
    <Box className={`customer ${css.class}`} flexGrow={1}>
      <div>
        <FormInputField form={form} name="userName" render={(props) => <input {...props} />} />
        {errors.userName && <div style={{ color: 'red' }}>User name is not correct</div>}
      </div>
      <div>
        <FormInputField form={form} name="note" render={(props) => <input {...props} />} />
      </div>
      <div>
        <FormInputField
          form={form}
          name="gender"
          render={(props) => {
            return (
              <select {...props}>
                <option value={1}>Man</option>
                <option value={2}>Woman</option>
                <option value={3}>None</option>
              </select>
            )
          }}
        />
        {errors.gender && <div style={{ color: 'red' }}>Gender is not correct</div>}
      </div>
      <div>
        <FormInputField
          form={form}
          name="married"
          type="checkbox"
          render={(props) => {
            return (
              <label>
                <input {...props} />
                Married
              </label>
            )
          }}
        />
      </div>
      <div>
        <FormInputField
          form={form}
          name="occupation"
          type="radio"
          value="student"
          render={(props) => {
            return (
              <label>
                <input {...props} />
                Student
              </label>
            )
          }}
        />
        <FormInputField
          form={form}
          name="occupation"
          type="radio"
          value="teacher"
          render={(props) => {
            return (
              <label>
                <input {...props} />
                Teacher
              </label>
            )
          }}
        />
        <FormInputField
          form={form}
          name="occupation"
          type="radio"
          value="engineer"
          render={(props) => {
            return (
              <label>
                <input {...props} />
                Engineer
              </label>
            )
          }}
        />
      </div>
      <button onClick={handleSave}>Save</button>

      <div>{JSON.stringify(form.values)}</div>
      <div style={{ color: 'red' }}>{JSON.stringify(form.errors)}</div>
    </Box>
  )
}

export default Customers
