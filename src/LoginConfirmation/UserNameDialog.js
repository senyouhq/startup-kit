import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

const useStyles = makeStyles({
  bigAvatar: {
    margin: 10,
    width: 120,
    height: 120,
  },
  pictureUpload: {
    appearance: 'none',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
})

export default function UserNameDialog({ open, onRegister, user }) {
  const classes = useStyles()
  const [inputs, setInputs] = React.useState({
    name: '',
    brandName: '',
    introduction: '',
    photo: '',
  })

  const handleUpdateInput = (key) => (event) => {
    setInputs({ ...inputs, [key]: event.target.value })
  }

  function handlePhotoSelected(event) {
    if (event.target.files.length < 1) {
      return
    }
    setInputs({ ...inputs, photo: event.target.files[0] })
  }

  if (!open) {
    return null
  }

  const resigterDisabled = inputs.name.trim() === '' || inputs.brandName.trim() === ''

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
      <DialogTitle>新規ユーザー登録</DialogTitle>

      <DialogContent>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Avatar
            alt={user && user.name ? user.name : 'profile photo'}
            src={user && user.photoURL}
            className={classes.bigAvatar}
          ></Avatar>
          <Button variant="contained">
            写真を選択
            <input
              type="file"
              accept="image/*"
              className={classes.pictureUpload}
              onChange={handlePhotoSelected}
            />
          </Button>
        </Box>

        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          defaultValue={user.email || user.userInfo.user_email}
          disabled
          fullWidth
          label="メール"
          variant="filled"
        />

        <TextField
          autoFocus
          margin="normal"
          type="text"
          label="ユーザー名"
          fullWidth
          value={inputs.name}
          onChange={handleUpdateInput('name')}
        />
        <TextField
          autoFocus
          margin="normal"
          type="text"
          label="ブランド名"
          fullWidth
          value={inputs.brandName}
          onChange={handleUpdateInput('brandName')}
        />
        <TextField
          autoFocus
          margin="normal"
          type="text"
          label="自己紹介"
          fullWidth
          value={inputs.introduction}
          onChange={handleUpdateInput('introduction')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onRegister(inputs)} color="primary" disabled={resigterDisabled}>
          登録
        </Button>
      </DialogActions>
    </Dialog>
  )
}
