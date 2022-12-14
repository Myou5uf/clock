# clock
Проект представляет собой Web-страницу с двумя часами и возможностью выбора пользователем часовой пояс. Все часы в любой момент времени показывают локальное время клиентской машины с учетом корректировки на выбранный пользователем часовой пояс.
Часовой пояс определяется выбором в выпадающем списке. По умолчанию в обоих часах выбран первый из списка часовой пояс. Применение соответствующего часового пояса осуществляется одновоременно с выбором города.

Для отрисовки стрелочных часов использовался простой scss и картинка циферблата. Список часовых поясов загружается путем выполнения сетевого запроса c помощью метода ```fetch()```. Для сборки проекта был использован Webpack.

Для того чтобы реализовать смену часового пояса был использован встроенный объект ```Date```. Он содержит дату и время, а также предоставляет методы управления ими. Чтобы получить время, соответствующее выбранному часовому поясу, необходимо было высчитать разницу между локальным часовым поясом клиента и выбранным из выпадающего списка часовой пояс.  

```js
this._timeZoneDifference = -(-this._localTimeZone - selectedTimeZone);
```

С помощью полученной разницы создается новый экземпляр объекта Date, который содержит уже дату и время, соответствующее выбранному часовому поясу. Также, чтобы на странице часы показывали актуальное время использовался метод ```setInterval()```, который производит выполнение кода через указанный интервал времени

```js
this._date = new Date(this.getTime(this._timeZoneDifference));
```

```getTime()``` - это метод возвращает строку вида  **"2022-8-27 19:43:39 +7"**


Из этого нового экземпляра Date получаем часы, минуты, секунды и высчитываем градусы для соответствующих стрелок: 
```js
const hours = this._date.getHours() * 30;       // 1 hour = 30 deg  
const minutes = this._date.getMinutes() * 6;    // 1 min = 6 deg  
const seconds = this._date.getSeconds() * 6;    // 1 sec = 6 deg  
```
Задаем цифровым часам единый формат вида **ЧЧ:ММ:СС**
```js
let fHours = this._date.getHours() < 10 ? `0${this._date.getHours()}` : this._date.getHours();
let fMinutes = this._date.getMinutes() < 10 ? `0${this._date.getMinutes()}` : this._date.getMinutes();
let fSeconds = this._date.getSeconds() < 10 ? `0${this._date.getSeconds()}` : this._date.getSeconds();
```

Далее добавляем в разметку:

```js
timeElement.innerHTML = `${fHours}:${fMinutes}:${fSeconds}`;

hoursArrow.style.transform = `rotateZ(${hours + minutes / 12}deg)`;
minutesArrow.style.transform = `rotateZ(${minutes}deg)`;
secondsArrow.style.transform = `rotateZ(${seconds}deg)`;
```
