import { useState, useRef, useEffect } from 'react';

import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';

import styles from './ArticleParamsForm.module.scss';
import { clsx } from 'clsx';

import { Select } from '../select';
import { RadioGroup } from '../../components/radio-group';
import { Separator } from '../../components/separator';
import { Text } from '../text';

import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';

type ArticleParamsFormProps = {
	params: ArticleStateType;
	onChange: (params: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	params,
	onChange,
}: ArticleParamsFormProps) => {
	const [state, setState] = useState(false);
	const [fontFamilyOption, setfontFamilyOption] = useState(
		params.fontFamilyOption
	);
	const [fontSizeOption, setFontSizeOption] = useState(params.fontSizeOption);
	const [fontColor, setFontColor] = useState(params.fontColor);
	const [backgroundColor, setBackgroundColor] = useState(
		params.backgroundColor
	);
	const [contentWidth, setContentWidth] = useState(params.contentWidth);

	const refForm = useRef<HTMLFormElement | null>(null);
	const toggleForm = () => {
		setState(!state);
	};

	// закрытие формы по клику на оверлей и по нажатию на Escape
	useEffect(() => {
		if (!state) return;

		const handleClickOutside = (evt: MouseEvent) => {
			if (refForm.current && !refForm.current.contains(evt.target as Node)) {
				toggleForm();
			}
		};

		const handleEsc = (evt: KeyboardEvent) => {
			if (evt.key === 'Escape') {
				toggleForm();
			}
		};

		document.addEventListener('keydown', handleEsc);
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('keydown', handleEsc);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [state, toggleForm, refForm]);

	// сброс настроек формы к начальным
	const resetFormSettings = () => {
		setfontFamilyOption(defaultArticleState.fontFamilyOption);
		setFontSizeOption(defaultArticleState.fontSizeOption);
		setFontColor(defaultArticleState.fontColor);
		setBackgroundColor(defaultArticleState.backgroundColor);
		setContentWidth(defaultArticleState.contentWidth);
		onChange(defaultArticleState);
	};

	// обработчик сабмита формы
	const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		onChange({
			fontFamilyOption,
			fontSizeOption,
			fontColor,
			backgroundColor,
			contentWidth,
		});
	};

	return (
		<>
			<ArrowButton state={state} onClick={() => setState(!state)} />
			<aside className={clsx(styles.container, state && styles.container_open)}>
				<form className={styles.form} ref={refForm} onSubmit={handleSubmit}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						selected={fontFamilyOption}
						options={fontFamilyOptions}
						onChange={setfontFamilyOption}
					/>
					<RadioGroup
						name='Размер шрифта'
						title='Размер шрифта'
						selected={fontSizeOption}
						options={fontSizeOptions}
						onChange={setFontSizeOption}
					/>
					<Select
						title='Цвет шрифта'
						selected={fontColor}
						options={fontColors}
						onChange={setFontColor}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						selected={backgroundColor}
						options={backgroundColors}
						onChange={setBackgroundColor}
					/>
					<Select
						title='Ширина контента'
						selected={contentWidth}
						options={contentWidthArr}
						onChange={setContentWidth}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' onClick={resetFormSettings} />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
