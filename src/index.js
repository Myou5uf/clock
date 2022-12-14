import "./scss/style.scss";

const requestURL = "./timezones.json";
const clocksWrapper = document.querySelector(".clocks");

class Time {
    _date; // Текущая дата на компьютере
    _localTimeZone; // Локальный часовой пояс, установленный на ПК
    _selectedTimeZone; // Выбранный часовой пояс из выпадающего списка
    _timeZoneDifference; // Разница между локальным и выбранным часовым поясом

    // Элементы страницы
    _clock; //  Контейнер
    _hoursArrow; //  Часовая стрелка
    _minutesArrow; //  Минутная стрелка
    _secondsArrow; //  Секундная стрелка
    _timeElement; //  Цифровое часы
    _timeZonesSelect; //  Выпадающий список с часовыми поясами
    _interval; //  setInterval

    static #maxInstances = 24; // Максимальное кол-во экемпляров класса
    static #instances = 0; // Кол-во экземпляров класса

    constructor(wrapper, timeZonesURL) {
        Time.#instances++;
        if (Time.#instances > Time.#maxInstances) {
            throw new Error(`Вы создали максимальное количество экземпляров: ${Time.#maxInstances}`);
        }
        this._date = new Date();

        this._clock = this.getCloneTemplate();
        this._hoursArrow = this._clock.querySelector(".clock__hours");
        this._minutesArrow = this._clock.querySelector(".clock__minutes");
        this._secondsArrow = this._clock.querySelector(".clock__seconds");
        this._timeElement = this._clock.querySelector(".time");
        this._timeZonesSelect = this._clock.querySelector(".timezones");

        this.appendWidget(wrapper, timeZonesURL);

        this._timeZonesSelect.addEventListener("change", (e) => {
            this.changeTimeZone(e.target.value);
        });
    }

    // Сменить часовой пояс
    changeTimeZone(selectedTimeZone) {
        this._selectedTimeZone = selectedTimeZone;
        this.startClock(this._hoursArrow, this._minutesArrow, this._secondsArrow, this._timeElement, selectedTimeZone);
    }

    // Получить данные с файла
    getTimezonesFromDB(url) {
        return fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.status);
                }
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log("Данные получены с ошибкой: " + error.message);
            });
    }

    // Вернуть дату в формате "2022-8-27 19:43:39 +7"
    getTime(timeZoneDiffernce = 0) {
        const currentLocalTime = new Date();
        const currentTimezone = currentLocalTime.getTimezoneOffset() / 60;
        return currentLocalTime.getFullYear() + "-" + (currentLocalTime.getMonth() + 1) + "-" + currentLocalTime.getDate() + " " + currentLocalTime.getHours() + ":" + currentLocalTime.getMinutes() + ":" + currentLocalTime.getSeconds() + " " + `+${-currentTimezone - timeZoneDiffernce}`;
    }

    // Получить клон шаблона
    getCloneTemplate() {
        const template = document.querySelector("#clock-template");
        const contentTemplate = template.content.cloneNode(true);
        return contentTemplate;
    }

    // Добавить часы на страницу
    appendWidget(wrapper, url) {
        this.getTimezonesFromDB(url).then((timeZones) => {
            // заполнение select полученными данными (timeZones)
            timeZones.forEach((timeZone, index) => {
                if (index === 0) {
                    this._timeZonesSelect.innerHTML += `<option class="timezones__item" value="${timeZone.timezone}" selected>${timeZone.name}</option>`;
                } else {
                    this._timeZonesSelect.innerHTML += `<option class="timezones__item" value="${timeZone.timezone}">${timeZone.name}</option>`;
                }
            });

            wrapper.append(this._clock);
            this._selectedTimeZone = this._timeZonesSelect.value;
            this.startClock(this._hoursArrow, this._minutesArrow, this._secondsArrow, this._timeElement, this._selectedTimeZone);
        });
    }

    // Запустить часы
    startClock(hoursArrow, minutesArrow, secondsArrow, timeElement, selectedTimeZone) {
        clearInterval(this._interval);

        this._localTimeZone = this._date.getTimezoneOffset() / 60; // локальный часовой пояс в часах
        this._timeZoneDifference = -(-this._localTimeZone - selectedTimeZone); // разница между локальным и выбранным часовым поясом

        this._interval = setInterval(() => {
            // Создаем новое время со смещением _timeZoneDifference
            this._date = new Date(this.getTime(this._timeZoneDifference));

            // Высчитываем градусы для соответствующих стрелок
            const hours = this._date.getHours() * 30; // 1 hour = 30 deg
            const minutes = this._date.getMinutes() * 6; // 1 min = 6 deg
            const seconds = this._date.getSeconds() * 6; // 1 sec = 6 deg

            // Добавляем 0, если часы или мин. или сек. меньше 0
            let fHours = this._date.getHours() < 10 ? `0${this._date.getHours()}` : this._date.getHours();
            let fMinutes = this._date.getMinutes() < 10 ? `0${this._date.getMinutes()}` : this._date.getMinutes();
            let fSeconds = this._date.getSeconds() < 10 ? `0${this._date.getSeconds()}` : this._date.getSeconds();

            // Добавляем в разметку
            timeElement.innerHTML = `${fHours}:${fMinutes}:${fSeconds}`;

            hoursArrow.style.transform = `rotateZ(${hours + minutes / 12}deg)`;
            minutesArrow.style.transform = `rotateZ(${minutes}deg)`;
            secondsArrow.style.transform = `rotateZ(${seconds}deg)`;
        }, 100);
    }
}

const day1 = new Time(clocksWrapper, requestURL); // eslint-disable-line no-unused-vars
const day2 = new Time(clocksWrapper, requestURL); // eslint-disable-line no-unused-vars
