import { MenuItem, TextField } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../.theme/theme'
import { ChapterBase } from '@/app/lib/types'

declare module '@mui/material/TextField' {
	// eslint-disable-next-line no-unused-vars
	interface TextFieldPropsColorOverrides {
		'mvc-green': true
		'mvc-yellow': true
		'mvc-white': true
		'mvc-gray': true
	}
}
interface ThemedTextFieldProps extends PropsWithChildren {
	label: string
	size?: 'small' | 'medium'
	variant?: 'filled' | 'outlined' | 'standard'
	required?: boolean
	autoFocus?: boolean
	select?: boolean
	options?: ChapterBase[] // this needs a better type
	enableAdd?: boolean
	onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ThemedTextField({
	label,
	size = 'medium',
	variant = 'standard',
	required = false,
	autoFocus = false,
	select = false,
	options = [],
	enableAdd,
	onInput,
	onChange
}: ThemedTextFieldProps) {
	function getOptionsMenuItems() {
		const optionsMenuItems = options.map((opt) => {
			return (
				<MenuItem value={opt.id} key={opt.id}>
					{opt.name}
				</MenuItem>
			)
		})

		return !enableAdd
			? optionsMenuItems
			: [
					...optionsMenuItems,
					<MenuItem value="add" key="add" sx={{ fontStyle: 'italic' }}>
						+ Add New
					</MenuItem>
				]
	}

	return (
		<div className="flex items-center">
			<>
				<ThemeProvider theme={theme}>
					<TextField
						autoFocus={autoFocus}
						fullWidth
						variant={variant}
						size={size}
						label={label}
						required={required}
						select={select}
						defaultValue=""
						color="mvc-green"
						onInput={onInput}
						onChange={onChange}
						sx={{
							'.MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error)::before': {
								borderBottom: '2px solid var(--mvc-yellow)'
							}
						}}>
						{getOptionsMenuItems()}
					</TextField>
				</ThemeProvider>
			</>
		</div>
	)
}
