const escorcioPicker = class {

	constructor(options) {
		const _this = this;

		this.modal = document.getElementsByClassName('escorciopicker-modal')[0];
		this.title = document.getElementsByClassName('escorciopicker-navigation-label')[0];
		this.closeIcon = document.getElementsByClassName('escorciopicker-close')[0];

		this.input = options.input;
		this.formatDate = options.customFormat;

		this.monthContent = document.getElementsByClassName("escorciopicker-monthdays")[0];
		this.monthsContent = document.getElementsByClassName("escorciopicker-months-month-wrapper")[0];
		this.yearsContent =  document.getElementsByClassName("escorciopicker-years-year-wrapper")[0];

		this.prev = document.getElementsByClassName("escorciopicker-navigation-prev")[0];
		this.next = document.getElementsByClassName("escorciopicker-navigation-next")[0];
		this.navigation = document.getElementsByClassName("escorciopicker-navigation-label")[0];


		this.next.addEventListener("click", () => {
			_this.nextMonth.call(_this);
		});

		this.prev.addEventListener("click", () => {
			_this.prevMonth.call(_this);
		});

		this.navigation.addEventListener("click", () => {
			_this.changeNavigation.call(_this);
		});

		this.input.addEventListener("click", () => {
			_this.modal.style.display = 'block';
		});

		this.closeIcon.addEventListener("click", () => {
			_this.modal.style.display = 'none';
		});

		document.addEventListener("click", (event) => {
			this.onClickOutsideModeOne.call(_this, event);
		});

		this.daysOfTheWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
		this.months = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

		if(options.minDate === "today") {
			this.minDate = new Date();
		} else {
			this.minDate = new Date(options.minDate.year, (options.minDate.month + 1), (options.minDate.day + 1));
		}

		this.minDate.setHours(0,0,0,0);

		this.excludeDays = options.excludeDays;

		this.mode = 1;

		this.getDays("today");
	}

	generateDay(options) {
		if(options.disable) {
			return `<button data-day="${options.day}" class="escorciopicker-monthdays-day ${options.nextMonth ? "next-month" : ""} ${options.isToday ? "today" : ""}" disabled="" type="button"><abbr>${options.day}</abbr></button>`;
		} else {
			return `<button data-day="${options.day}" class="escorciopicker-monthdays-day ${options.nextMonth ? "next-month" : ""} ${options.isToday ? "today" : ""}" type="button"><abbr>${options.day}</abbr></button>`;
		}
	}

	generateMonth(options) {
		if(options.disable) {
			return `<button data-month="${options.month}" class="escorciopicker-months-month" disabled="" type="button"><abbr>${options.name}</abbr></button>`;
		} else {
			return `<button data-month="${options.month}" class="escorciopicker-months-month" type="button"><abbr>${options.name}</abbr></button>`;
		}
	}

	generateYear(options) {
		if(options.disable) {
			return `<button data-year="${options.year}" class="escorciopicker-years-year" disabled="" type="button"><abbr>${options.name}</abbr></button>`;
		} else {
			return `<button data-year="${options.year}" class="escorciopicker-years-year" type="button"><abbr>${options.name}</abbr></button>`;
		}
	}

	getDays(options) {
		const _this = this;
		let date = '';
		let minDate = '';

		if(options === "today") {
			date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		} else {
			date = new Date(options.year, options.month, 1);
		}

		const year = date.getFullYear();
		const month = date.getMonth();
		const days = date.getDate();
		const firstWeekDayOfTheMonth = date.getDay();

		// return how many days the current date month has
		const dateOfTheCurrentMonth = new Date(year, (month + 1), 0);

		// return the date Object of the previous month of the current date
		const previousMonthDate = new Date(year, month, 0);

		this.month = month;
		this.year = year;

		this.title.innerText = this.months[month] + " de " + year;
		this.monthContent.innerHTML = "";

		let generateDays = [];

		// generate the days of the previous month
		for(let i = firstWeekDayOfTheMonth - 1; i >= 0; i--) {
			generateDays.push(_this.generateDay({
				day: previousMonthDate.getDate() - i,
				disable: _this.checkDisabledDate(new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth(), previousMonthDate.getDate() - i)),
				isToday: false
			}));
		}

		// generate the days of the month
		for(let i = 1; i < (dateOfTheCurrentMonth.getDate() + 1); i++) {
			generateDays.push(_this.generateDay({
				day: i,
				disable: _this.checkDisabledDate(new Date(dateOfTheCurrentMonth.getFullYear(), dateOfTheCurrentMonth.getMonth(), i)),
				isToday: _this.checkTodayDay(new Date(dateOfTheCurrentMonth.getFullYear(), dateOfTheCurrentMonth.getMonth(), i)),
			}));
		}

		//generate the next month days
		if(generateDays.length > 35) {
			const needThisDays = (42 - generateDays.length);
			for(let i = 1; i < (needThisDays + 1); i++) {
				generateDays.push(_this.generateDay({
					day: i,
					isDisabled: _this.checkDisabledDate( new Date( (_this.month === 11 ? _this.year + 1 : _this.year), (this.month === 11 ? 0 : this.month), i ) ),
					nextMonth: true
				}));
			}
		} else {
			const needThisDays = (35 - generateDays.length);
			for(let i = 1; i < (needThisDays + 1); i++) {
				generateDays.push(_this.generateDay({
					day: i,
					isDisabled: _this.checkDisabledDate( new Date( (_this.month === 11 ? _this.year + 1 : _this.year), (this.month === 11 ? 0 : this.month), i ) ),
					nextMonth: true
				}));
			}
		}

		this.monthContent.innerHTML = generateDays.join("");
	}

	getMonths(year) {
		const _this = this;

		this.year = year;

		this.navigation.innerText = this.year;

		let generateMonths = [];

		for(let i = 0; i < 12; i++) {
			generateMonths.push(_this.generateMonth({
				name: _this.months[i],
				month: i,
				disable: this.checkDisabledMonth(i, year)
			}))
		}

		this.monthsContent.innerHTML = generateMonths.join('');
	}

	getYears(year) {
		const _this = this;

		this.decadeYears = [];

		const generateYears = [];

		const startYear = Math.floor( (year || this.year) / 10) * 10;
		const endYear = startYear + 9;

		for(let i = startYear; i <= endYear + 1; i++) {
			_this.decadeYears.push(i);
			generateYears.push(_this.generateYear({
				disable: _this.year > i,
				name: i,
				year: i
			}));	
		}

		this.navigation.innerText = this.decadeYears[0] + "-" + this.decadeYears.at(-1);

		this.yearsContent.innerHTML = generateYears.join('');
	}

	prevMonth() {
		if(this.mode === 1) {
			this.getDays({
				month: this.month === 0 ? 11 : this.month - 1,
				year: this.month === 0 ? this.year - 1 : this.year
			});
		} else if(this.mode === 2) {
			this.getMonths(this.year - 1);
		} else if(this.mode === 3) {
			this.getYears(this.decadeYears[0] - 1);
		}

		this.checkPrevArrow();
	}	

	nextMonth() {
		if(this.mode === 1) {
			this.getDays({
				month: this.month + 1 > 11 ? 0 : this.month + 1,
				year: this.month + 1 > 11 ? this.year + 1 : this.year
			});
		} else if(this.mode === 2) {
			this.getMonths(this.year + 1);
		} else if(this.mode === 3) {
			this.getYears(this.decadeYears.at(-1));
		}

		this.checkPrevArrow();
	}

	changeNavigation(gotoMode){

		if(gotoMode) {
			this.mode = gotoMode;
		} else {
			this.mode = this.mode + 1;
		}

		document.querySelectorAll(".escorciopicker-container > *").forEach((node) => {
			node.style.display = 'none';
		});

		if(this.mode === 1) {
			document.getElementsByClassName("escorciopicker-month")[0].style.display = 'block';
			this.getDays({ month: this.month, year: this.year });
			this.checkPrevArrow();
		} else if(this.mode === 2) {
			document.getElementsByClassName("escorciopicker-months")[0].style.display = 'block';
			this.getMonths(this.year);
			this.checkPrevArrow();
		} else if(this.mode === 3) {
			document.getElementsByClassName("escorciopicker-years")[0].style.display = 'block';
			this.getYears(this.year);
			this.checkPrevArrow();
		}
	}

	checkDisabledDate(date) {
		const minDateTimestamp = this.minDate.getTime();
		let isDisabled = false;

		date.setHours(0,0,0,0);
		isDisabled = date.getTime() < minDateTimestamp;

		if(isDisabled) return isDisabled;

		if(this.excludeDays.weekdays) {
			isDisabled = this.excludeDays.weekdays.includes(date.getDay());
			if(isDisabled) return isDisabled;
		}

		if(this.excludeDays.specificDates) {
			const day = date.getDate();
			const month = parseInt(("0" + (date.getMonth() + 1)).slice(-2));
			const year = date.getFullYear();

			this.excludeDays.specificDates.forEach((_date) => {
				if(!isDisabled) {
					let dateSplitted = _date.split("-");

					if(dateSplitted.length === 2) {
						isDisabled = day === parseInt(dateSplitted[0]) && month === parseInt(dateSplitted[1]);
					} else {
						isDisabled = day === parseInt(dateSplitted[0]) && month === parseInt(dateSplitted[1]) && year === parseInt(dateSplitted[2]);
					}
				}
			});

			if(isDisabled) return isDisabled;
		}

		return isDisabled;
	}

	checkDisabledMonth(_month, _year) {
		const month = this.minDate.getMonth();
		const year = this.minDate.getFullYear();

		if(_year > _year) {
			return false
		} else  if(year === _year){
			return _month < month;
		} else {
			return false;
		}
	}

	checkTodayDay(_date) {
		const today = new Date().toString().split(" ");
		const date = _date.toString().split(" ");

		return today[1] === date[1] && today[2] === date[2] && today[3] === date[3];
	}

	checkPrevArrow(){
		let disableArrow = '';

		if(this.mode === 1){
			disableArrow = this.minDate.getMonth() === this.month && this.minDate.getFullYear() === this.year;
		} else if(this.mode === 2) {
			disableArrow = this.minDate.getFullYear() === this.year;
		} else if(this.mode === 3) {
			disableArrow = this.decadeYears.includes(this.minDate.getFullYear());
		}

		if(disableArrow) {
			this.prev.setAttribute("disabled", true);
		} else {
			this.prev.removeAttribute("disabled");
		}
	}

	getDateInFormat(year, month, day, format) {
		const date = new Date(year, month - 1, day);

		const formatTokens = {
			'YYYY': date.getFullYear(),
			'MM': String(date.getMonth() + 1).padStart(2, '0'),
			'DD': String(date.getDate()).padStart(2, '0'),
		};

		let formattedDate = format;
		for (const token in formatTokens) {
			formattedDate = formattedDate.replace(token, formatTokens[token]);
		}

		return formattedDate;
	}

	onClickOutsideModeOne(event) {
		const classList = event.target.classList;

		if(classList.contains("escorciopicker-months-month")) {
			this.month = parseInt(event.target.dataset.month);
			this.changeNavigation(1);
		} else if(classList.contains("escorciopicker-years-year")) {
			this.year = parseInt(event.target.dataset.year);
			this.changeNavigation(2);
		} else if(classList.contains("escorciopicker-monthdays-day")) {
			this.day = parseInt(event.target.dataset.day);
			this.input.value = this.getDateInFormat(this.year, this.month, this.day, this.formatDate);
			this.modal.style.display = 'none';
		}
	}	
};
