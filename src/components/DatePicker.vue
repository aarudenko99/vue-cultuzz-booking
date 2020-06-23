<template>
  <div class="form-control d-flex align-items-center drop-down-container date-picker"
       :id="$uid"
       :disabled="disabled"
       :tabindex="disabled ? -1 : 0"
       @focus="focused"
       @blur="blurred"
       @mousedown="lastEvent = 'm'"
       @keydown="lastEvent = 'k'"
       @click="clicked"
  >
    <svg class="icon mr-3" width="14" height="15" viewBox="0 0 14 15">
      <use xlink:href="/assets/icons/icons.svg#calendar"/>
    </svg>
    <span class="flex-grow-1">{{ title }}</span>
    <svg class="arrow" stroke-width="2" width="12" height="7" viewBox="0 0 12 7">
      <use xlink:href="/assets/icons/icons.svg#arrow-down"/>
    </svg>
    <div ref="menu" class="drop-down-menu position-absolute d-none" :class="positionClass">
      <nav class="d-flex align-items-center mb-2">
        <b-btn tabindex="-1" class="btn-icon btn-icon-round"
               variant="outline-primary" @mousedown.stop.prevent="prevMonth">
          <svg class="arrow" stroke-width="1" width="10" height="16" viewBox="0 0 13 22">
            <use xlink:href="/assets/icons/icons.svg#arrow-left"/>
          </svg>
        </b-btn>
        <span class="text-sm text-center flex-grow-1">{{ monthYear }}</span>
        <b-btn tabindex="-1" class="btn-icon btn-icon-round"
               variant="outline-primary" @mousedown.stop.prevent="nextMonth">
          <svg class="arrow" stroke-width="1" width="10" height="16" viewBox="0 0 13 22">
            <use xlink:href="/assets/icons/icons.svg#arrow-right"/>
          </svg>
        </b-btn>
      </nav>
      <div class="wdays d-flex text-sm font-weight-bold">
        <div v-for="(wd, idx) in weekdays" :key="idx" :class="{ 'text-primary': idx > 4 }">{{ wd }}</div>
      </div>
      <div class="days d-flex flex-wrap text-sm">
        <div v-for="(d, idx) in days" :key="idx" @mousedown.stop.prevent="select(d)"
             :class="{ 'today': d.today, 'current': d.current, 'disabled': d.disabled }">
          {{ d.day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'DatePicker',
    props: {
      placeholder: String,
      value: {
        type: [Date, moment],
      },
      minDate: {
        type: [Date, moment],
      },
      maxDate: {
        type: [Date, moment],
      },
      position: {
        type: String,
        default: 'left',
        validate: (p) => ['left', 'right'].indexOf(p) !== -1,
      },
      disabled: Boolean,
    },
    data: () => ({
      // shown: false,
      lastEvent: null,
      preventClick: false,
      positionClass: '',
      weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      current: null,
    }),
    created() {
      this.positionClass = `from-${this.position}`;
      this.resetCurrent();
    },
    computed: {
      title() {
        return this.value == null ? this.placeholder || 'No date selected' : this.value.format('D MMM YYYY');
      },
      monthYear() {
        return this.current.format('MMMM YYYY');
      },
      days() {
        const today = moment();
        const todayDay = this.current.isSame(today, 'month') ? today.date() : false;
        const currentDay = this.value != null && this.value.isSame(this.current, 'month') ? this.value.date() : false;
        let disabledBefore = false;
        let disabledAfter = false;
        if (this.minDate != null) {
          if (this.current.isBefore(this.minDate, 'month')) {
            disabledBefore = 99;
          } else if (this.current.isSame(this.minDate, 'month')) {
            disabledBefore = this.minDate.date();
          }
        }
        if (this.maxDate != null) {
          if (this.current.isAfter(this.maxDate, 'month')) {
            disabledBefore = -1;
          } else if (this.current.isSame(this.maxDate, 'month')) {
            disabledAfter = this.maxDate.date();
          }
        }
        let start = this.current.day() - 1;
        if (start < 0) start = 6;
        const ret = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < start; i++) ret.push({});
        const date = moment(this.current);
        do {
          const d = { day: date.date() };
          if (d.day === todayDay) d.today = true;
          if (d.day === currentDay) d.current = true;
          if (disabledBefore && d.day < disabledBefore) d.disabled = true;
          if (disabledAfter && d.day > disabledAfter) d.disabled = true;
          ret.push(d);
          date.add(1, 'day');
        } while (this.current.isSame(date, 'month'));
        return ret;
      },
    },
    methods: {
      show() {
        if (this.disabled) return;
        this.resetCurrent();
        this.$refs.menu.classList.remove('d-none');
        // this.shown = true;
      },
      hide() {
        this.$refs.menu.classList.add('d-none');
        // this.shown = false;
      },
      toggle() {
        if (this.$refs.menu.classList.contains('d-none')) {
          this.show();
        } else {
          this.hide();
        }
        // this.$refs.menu.classList.toggle('d-none');
        // this.shown = !this.shown;
      },
      resetCurrent() {
        this.current = (this.value ? moment(this.value) : moment())
          .startOf('month')
          .startOf('day');
      },
      focused() {
        this.preventClick = this.lastEvent === 'm';
        this.show();
      },
      blurred() {
        this.hide();
      },
      clicked(e) {
        const { classList, parentNode: { classList: parentClassList } } = e.target;
        if (!classList.contains('date-picker') && !parentClassList.contains('date-picker')) return;
        if (!this.preventClick) {
          this.toggle();
        }
        this.preventClick = false;
      },
      prevMonth() {
        this.current = moment(this.current)
          .subtract(1, 'month');
      },
      nextMonth() {
        this.current = moment(this.current)
          .add(1, 'month');
      },
      select(day) {
        if (day.day == null || day.disabled) return;
        this.$emit('input', moment(this.current).date(day.day));
        setTimeout(this.hide, 100);
      },
    },
  };
</script>
