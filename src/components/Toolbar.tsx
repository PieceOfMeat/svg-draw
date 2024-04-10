import React, { useEffect, useSyncExternalStore } from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import BorderClearIcon from '@mui/icons-material/BorderClear'
import Toolbar from '@mui/material/Toolbar'
import { useStateManager } from 'state/useStateManager'
import { TDToolType } from 'types'
import StylesSelector from './StylesSelector'
import toolsList, { ToolRecord } from './toolbarButtons'

interface ToolbarBtnProps extends ToolRecord {
  isVisible: boolean,
}

const toolbarButton = ({ title, type, Icon, isVisible }: ToolbarBtnProps) => {
  if (!isVisible) return null
  return (
    <ToggleButton key={type} title={title} value={type}>
      <Icon />
    </ToggleButton>
  )
}

type DrawToolbarProps = {
  readonly: boolean,
}

const DrawToolbar = React.memo(({ readonly }: DrawToolbarProps) => {
  const stateManager = useStateManager()
  const { pageState, toolbar } = stateManager
  const toolbarState = useSyncExternalStore(toolbar.subscribe, () => toolbar.state)
  const { hideGrid } = useSyncExternalStore(pageState.subscribe, () => pageState.getSettings())

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const styles = {
    size: matches ? 'small' : 'medium' as 'small' | 'medium',
    margin: matches ? 1 : 4,
    noGutters: matches,
  }

  const onToolChange = (e: React.BaseSyntheticEvent, value: TDToolType) => {
    stateManager.setTool(value)
  }

  const handleShowGridChange = () => {
    pageState.setSettings({ hideGrid: !hideGrid })
  }

  useEffect(() => {
    if (readonly) stateManager.setTool(TDToolType.Select)
  }, [readonly, stateManager])

  return (
    <Box m="auto" p={1} width="fit-content">
      <AppBar color="transparent" position="static">
        <Toolbar disableGutters={styles.noGutters} variant="dense">
          {!readonly && (
            <ToggleButtonGroup exclusive onChange={onToolChange} size={styles.size} value={toolbarState.tool}>
              {toolsList.map(tool => toolbarButton({
                isVisible: !readonly && toolbar.isVisible(tool.type),
                ...tool,
              }))}
            </ToggleButtonGroup>
          )}

          <ToggleButton
            onChange={handleShowGridChange}
            selected={!hideGrid}
            size={styles.size}
            sx={{ ml: styles.margin, mr: styles.margin }}
            title="Toggle Grid"
            value="check"
          >
            <BorderClearIcon />
          </ToggleButton>

          {!readonly && <StylesSelector />}
        </Toolbar>
      </AppBar>
    </Box>
  )
})

export default DrawToolbar
