class ArrangeBox {
	constructor() {
		this.container = document.querySelector('.container');
		this.createAvailablePositions = this.#creatingRandomAvailablePositions();
		this.#init();
	}
	// Создание основных элементов интерфейса
	#init() {
		this.control = this.#createControl();
		// Создание блоков под списки
		this.availableList = this.#createListPositions(
			'availableList',
			this.createAvailablePositions
		);
		this.selectedList = this.#createListPositions('selectedList');
		// Добавление узлов в конец списка дочерних элементов родительского узла контрола
		this.control.querySelector('.left')
			.appendChild(this.#createPanelBtnList(this.availableList));
		this.control.querySelector('.left')
			.appendChild(this.#createList('Доступные позиции', this.availableList));
		this.control.querySelector('.right')
			.appendChild(this.#createList('Выбранные позиции', this.selectedList));
		this.control.querySelector('.right')
			.appendChild(this.#createPanelBtnList(this.selectedList));
		this.container.appendChild(this.control);
		this.#switchBtnAll();
	}
	#createControl() {
		const containerElements = document.createElement('div');
		containerElements.classList.add('arrange-box');
		const leftBox = this.#createBox('left');
		const centerPanel = this.#createCentralPanel();
		const rightBox = this.#createBox('right');
		const options = this.#createOptions();
		containerElements.appendChild(leftBox);
		containerElements.appendChild(centerPanel);
		containerElements.appendChild(rightBox);
		containerElements.appendChild(options);
		return containerElements;
	}
	#createBox(position) {
		const box = document.createElement('div');
		box.classList.add('box', position);
		return box;
	}
	#createList(titleListPositions, listName) {
		const listPositions = document.createElement('div');
		listPositions.classList.add('list');
		const listNamePositions = document.createElement('div');
		listNamePositions.classList.add('list-name');
		listNamePositions.textContent = titleListPositions;
		const requestPositions = document.createElement('div');
		requestPositions.classList.add('search');
		const inputPositions = document.createElement('input');
		inputPositions.classList.add('search-input');
		inputPositions.setAttribute('placeholder', 'Начните набирать');
		inputPositions.addEventListener('input', () =>
			this.#filterPositions(inputPositions.value.toLowerCase(), listName)
		);
		requestPositions.appendChild(inputPositions);
		listPositions.appendChild(listNamePositions);
		listPositions.appendChild(requestPositions);
		listPositions.appendChild(listName);
		return listPositions;
	}
	// Фильтрация позиций по введенному пользователю тексту
	#filterPositions(searchPos, list) {
		list.querySelectorAll('.item').forEach((el) => {
			if (el.textContent.toLowerCase().includes(searchPos)) {
				el.classList.remove('disguised');
			} else {
				el.classList.add('disguised');
			}
		});
	}
	// Создание списка с элементами
	#createListPositions(id, arrPos = []) {
		const ulEl = document.createElement('ul');
		ulEl.classList.add('list-items');
		ulEl.setAttribute('id', id);
		arrPos.forEach((el) => {
			const liEl = this.#createLiElement(el);
			ulEl.appendChild(liEl);
		});
		return ulEl;
	}
	#createLiElement(el) {
		const liEl = document.createElement('li');
		liEl.textContent = el;
		liEl.classList.add('item');
		liEl.addEventListener('click', () => {
			liEl.classList.toggle('collect');
			this.#switchBtnAll();
		});
		return liEl;
	}
	#createCentralPanel() {
		const centralPanel = document.createElement('div');
		centralPanel.classList.add('panel', 'center');
		const buttons = [
			{
				icon: './icon/righticon.svg',
				action: () =>
					this.#shiftItems(this.availableList, this.selectedList, '.collect')
			},
			{
				icon: './icon/rightAllicon.svg',
				action: () =>
					this.#shiftAllItems(this.availableList, this.selectedList)
			},
			{
				icon: './icon/lefticon.svg',
				action: () =>
					this.#shiftItems(this.selectedList, this.availableList, '.collect')
			},
			{
				icon: './icon/leftAllicon.svg',
				action: () =>
					this.#shiftAllItems(this.selectedList, this.availableList)
			},
			{
				icon: './icon/optionsicon.svg',
				action: () =>
					this.control.querySelector('.options').classList.toggle('disguised')
			}
		];
		buttons.forEach(({ icon, action }) => {
			const btn = document.createElement('button');
			btn.innerHTML = `<img src="${icon}">`;
			btn.addEventListener('click', action);
			centralPanel.appendChild(btn);
		});
		return centralPanel;
	}
	// Перемещение выбранных элементов из одного списка в другой
	#shiftItems(sourceList, finiteList, selector) {
		const items = Array.from(sourceList.querySelectorAll(selector));
		const search = sourceList.parentElement.querySelector('.search-input');
		if (search.value.trim() !== '') {
			alert('Для перемещения элемента(-ов) сначала очистите поле поиска');
			return;
		}
		items.forEach((el) => {
			el.classList.remove('collect');
			finiteList.appendChild(el);
		});
		this.#switchBtnAll();
	}
	// Перемещение всех элементов из одного списка в другой
	#shiftAllItems(sourceList, finiteList) {
		const allItem = Array.from(sourceList.children);
		const searchInput = sourceList.parentElement.querySelector('.search-input');
		if (searchInput.value.trim() !== '') {
			alert('Для перемещения всех элементов сначала очистите поле поиска');
			return;
		}
		allItem.forEach((el) => finiteList.appendChild(el));
		this.#switchBtnAll();
	}
	// Создание кнопок дополнительных опций (спрятаны в кнопке "опции")
	#createOptions() {
		const options = document.createElement('div');
		options.classList.add('options', 'disguised');
		const buttons = [
			{
				text: 'Показать список доступных позиций',
				action: () =>
					alert(
						this.availableListItem.length > 0
							? `Доступные позиции:\n${this.availableListItem.join('\n')}`
							: 'Нет доступных позиций'
					)
			},
			{
				text: 'Показать список выбранных позиций',
				action: () =>
					alert(
						this.selectedListItem.length > 0
							? `Выбранные позиции:\n${this.selectedListItem.join('\n')}`
							: 'Нет выбранных позиций'
					)
			},
			{
				text: 'Вернуть данный ArrangeBox в начальное состояние',
				action: () => this.#resetToInitialState()
			},
			{
				text: 'Создать новый ArrangeBox',
				action: () => {
					alert('Ниже появится новый ArrangeBox');
					new ArrangeBox();
				}
			}
		];
		buttons.forEach(({ text, action }) => {
			const btn = document.createElement('button');
			btn.textContent = text;
			btn.addEventListener('click', action);
			options.appendChild(btn);
		});
		return options;
	}
	// Геттеры возвращают массивы позиций из соответствующих списков
	get getAvailableList() {
		return Array.from(this.availableList.querySelectorAll('.item'));
	}
	get getSelectedList() {
		return Array.from(this.selectedList.querySelectorAll('.item'));
	}
	// Геттеры возвращают массивы текстовых значений
	get availableListItem() {
		return this.getAvailableList.map((el) => el.innerText);
	}
	get selectedListItem() {
		return this.getSelectedList.map((el) => el.innerText);
	}
	#resetToInitialState() {
		this.container.removeChild(this.control);
		this.#init();
	}
	// Обновляет доступность кнопок в зависимости от состояния списков
	#switchBtnAll() {
		// Массивы кнопок (для левого списка, для правого списка и центральной панели), 
		// за исключением последних (last)
		const leftBtns = Array.from(
			this.control
				.querySelector('.left')
				.querySelectorAll('button:not(:last-Child)')
		);
		const rightBtns = Array.from(
			this.control
				.querySelector('.right')
				.querySelectorAll('button:not(:last-Child)')
		);
		const centerBtns = Array.from(
			this.control
				.querySelector('.center')
				.querySelectorAll('button:not(:last-Child)')
		);
		// Активация/деактивация кнопок
		this.#switchBtnInList(leftBtns, this.availableList);
		this.#switchBtnInList(rightBtns, this.selectedList);
		this.#switchBtnInCenter(centerBtns);
	}
	// Обновляет доступность кнопок в списке
	#switchBtnInList(btn, list) {
		const selectedPos = list.querySelectorAll('.collect');
		const isSelectedOne = selectedPos.length === 1;
		const isSelectedAny = selectedPos.length > 0;
		if (!list.querySelector('.collect')) {
			this.#switchBtn(btn, true);
			return;
		}
		this.#switchBtn(
			[btn[0], btn[1]],
			list.firstChild.classList.contains('collect')
		);
		this.#switchBtn(
			[btn[2], btn[3]],
			list.lastChild.classList.contains('collect')
		);
		if (isSelectedAny) {
			this.#switchBtn([btn[4]], !isSelectedOne);
			this.#switchBtn([btn[5]], false);
		} else {
			this.#switchBtn(btn, true);
		}
	}
	// Обновляет доступность кнопок в центральной панели
	#switchBtnInCenter(btn) {
		this.#switchBtn(
			[btn[0]],
			!this.getAvailableList.some((el) =>
				el.classList.contains('collect')
			)
		);
		this.#switchBtn([btn[1]], this.getAvailableList.length < 1);
		this.#switchBtn(
			[btn[2]],
			!this.getSelectedList.some((el) =>
				el.classList.contains('collect')
			)
		);
		this.#switchBtn([btn[3]], this.getSelectedList.length < 1);
	}
	// Управление доступностью переданных кнопок
	#switchBtn(btn, val) {
		btn.forEach((btn) => (btn.disabled = val));
	}
	// Создание кнопок, взаимодействующих с позициями
	#createPanelBtnList(listPositions) {
		const panelBtnList = document.createElement('div');
		panelBtnList.classList.add('panel', 'interacting');
		const btnMostUpPositions = document.createElement('button');
		const btnUpPositions = document.createElement('button');
		const btnDownPositions = document.createElement('button');
		const btnMostDownPositions = document.createElement('button');
		const editBtnPositions = document.createElement('button');
		const deleteBtnPositions = document.createElement('button');
		const addBtnPositions = document.createElement('button');
		btnMostUpPositions.innerHTML = '<img src="./icon/doubleUpArrowicon.svg">';
		btnMostUpPositions.addEventListener('click', () => {
			Array.from(listPositions.querySelectorAll('.collect'))
				.reverse()
				.forEach((el) =>
					listPositions.insertBefore(el, listPositions.firstChild)
				);
			this.#switchBtnAll();
		});
		btnUpPositions.innerHTML = '<img src="./icon/upArrowicon.svg">';
		btnUpPositions.addEventListener('click', () => {
			Array.from(listPositions.querySelectorAll('.collect')).forEach((el) => {
				const prevElemSibling = el.previousElementSibling;
				if (!prevElemSibling.classList.contains('collect')) {
					listPositions.insertBefore(el, prevElemSibling);
				}
			});
			this.#switchBtnAll();
		});
		btnDownPositions.innerHTML = '<img src="./icon/downArrowicon.svg">';
		btnDownPositions.addEventListener('click', () => {
			Array.from(listPositions.querySelectorAll('.collect')).reverse().forEach((el) => {
				const nextElemSibling = el.nextElementSibling;
				if (!nextElemSibling.classList.contains('collect')) {
					listPositions.insertBefore(nextElemSibling, el);
				}
			});
			this.#switchBtnAll();
		});
		btnMostDownPositions.innerHTML = '<img src="./icon/doubleDownArrowicon.svg">';
		btnMostDownPositions.addEventListener('click', () => {
			listPositions.querySelectorAll('.collect').forEach((el) => listPositions.append(el));
			this.#switchBtnAll();
		});
		editBtnPositions.innerHTML = '<img src="./icon/editPosition.svg">';
		editBtnPositions.addEventListener('click', () => {
			const selectedItems = listPositions.querySelectorAll('.collect');
			const newName = prompt('Введите новое изменение для позиции:', selectedItems[0].textContent);
			const isTrim = newName.trim() === '';
			if (!isTrim) {
				selectedItems[0].textContent = newName;
			} else if (isTrim) {
				alert('Вы не изменили позицию! Пустая строка.\nВ списке ничего не изменилось.');
			}
		});
		deleteBtnPositions.innerHTML = '<img src="./icon/deletePosition.svg">';
		deleteBtnPositions.addEventListener('click', () => {
			const selectedItems = listPositions.querySelectorAll('.collect');
			if (confirm('Вы уверены, что хотите удалить выбранную(-ые) позицию(-и)?')) {
				selectedItems.forEach(el => el.remove());
			}
			this.#switchBtnAll();
		});
		addBtnPositions.innerHTML = '<img src="./icon/addPosition.svg">';
		addBtnPositions.addEventListener('click', () => {
			const newItemElement = prompt('Введите новую позицию:');
			if (newItemElement.trim() === '') {
				alert('Вы не написали название позиции!\nВ список ничего не добавилось.');
			} else {
				listPositions.appendChild(this.#createLiElement(newItemElement));
			}
			this.#switchBtnAll();
		});
		panelBtnList.appendChild(btnMostUpPositions);
		panelBtnList.appendChild(btnUpPositions);
		panelBtnList.appendChild(btnDownPositions);
		panelBtnList.appendChild(btnMostDownPositions);
		panelBtnList.appendChild(editBtnPositions);
		panelBtnList.appendChild(deleteBtnPositions);
		panelBtnList.appendChild(addBtnPositions);
		return panelBtnList;
	}
	#creatingRandomAvailablePositions(quantityPositions = 5) {
		const products = [
			'Blackberry',
			'Banana',
			'Meat',
			'Pasta',
			'Apple',
			'Strawberry',
			'Preserves',
			'Pineapple'
		];
		const prices = [
			'80р.',
			'75р.',
			'126р.',
			'100р.',
			'150р.',
			'174р.',
			'113р.',
			'94р.'
		];
		const availablePos = new Set();
		while (availablePos.size < quantityPositions) {
			const productsIndex = Math.floor(Math.random() * products.length);
			const pricesIndex = Math.floor(Math.random() * prices.length);
			availablePos.add(`${products[productsIndex]} ${prices[pricesIndex]}`);
		}
		return Array.from(availablePos);
	}
}

const arrangeBox = new ArrangeBox();
