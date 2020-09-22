import React from 'react'
import { useHistory } from 'react-router-dom'
import firebase from 'service/firebase'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import StorefrontIcon from '@material-ui/icons/Storefront'
import ListAltIcon from '@material-ui/icons/ListAlt'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import ViewListIcon from '@material-ui/icons/ViewList'
import RecentActorsIcon from '@material-ui/icons/RecentActors'

import useAuth from 'hooks/useAuth'
import useBrand from 'hooks/useBrand'

import Sidemenu from './Sidemenu'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },

  title: {
    flexGrow: 1,
  },
}))

function Header({ className, onClick, disabled, children, varient }) {
  const history = useHistory()
  const classes = useStyles()
  const [sidemenuOpen, setSidemenuOpen] = React.useState(false)
  // const [sidemenus, setSidemenus] = React.useState([])

  // React.useEffect(() => {
  //   setSidemenus(filtered)
  // }, [brandId])

  function handleLogout() {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.assign('/sign-in')
      })
  }

  // function handleAccountClick() {
  //   setSidemenuOpen(false)
  //   history.push(`/users/${auth.state.user.id}/edit`)
  // }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setSidemenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Senyou startup-kit</Typography>
        </Toolbar>
      </AppBar>
      <Sidemenu
        // user={auth.state.user}
        user={{}}
        // menus={sidemenus}
        open={sidemenuOpen}
        // onAccountClick={handleAccountClick}
        // onMenuClick={handleMenuClick}
        onClose={() => setSidemenuOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  )
}

export default Header
