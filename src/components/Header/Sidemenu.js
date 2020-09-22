import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

const useStyles = makeStyles({
  list: {
    width: 250,
  },

  fullList: {
    width: 'auto',
  },

  sideMenu: {
    width: '60vw',
    maxWidth: 250,
  },
})

export default function Sidemenu({
  user,
  open,
  onClose,
  onAccountClick,
  onMenuClick,
  onLogout,
  menus = [],
}) {
  const classes = useStyles()

  const Menus = menus.map((menu, index) => {
    if (menu.divider) {
      return <Divider key={index} />
    }
    return (
      <ListItem button key={menu.name} onClick={() => onMenuClick(menu)}>
        {menu.icon && <ListItemIcon>{menu.icon}</ListItemIcon>}
        <ListItemText primary={menu.label || menu.name} />
      </ListItem>
    )
  })
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div className={classes.sideMenu}>
        <List>
          <ListItem key={'User name'} onClick={onAccountClick}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={user.displayName} secondary={user.isAdmin ? '(admin)' : ''} />
          </ListItem>
        </List>
        {!!menus.length && <Divider />}
        <List>{Menus}</List>
        <Divider />
        <List>
          <ListItem button key={'Sign out'} onClick={onLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={'Sign out'} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  )
}
