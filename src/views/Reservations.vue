<template>
  <div class="page-reservations" id="page-reservations">
    <div class="panel search-form">
      <div class="panel-title position-relative w-100 title">
        <p>Reservations</p>
      </div>
      <div class="row pt-3">
        <div class="col-12 cell-search-for">
          <label class="text-xs mb-1" for="search-for">Search for</label>
          <drop-down
            id="search-for"
            :disabled="pending"
            :items="searchForItems"
            v-model="searchFor"
          />
        </div>
        <div class="col-12 cell-date-picker">
          <label class="text-xs mb-1" for="date-from">From</label>
          <date-picker id="date-from" v-model="minDate"
                       :disabled="pending" @input="fromChanged" />
        </div>
        <div class="col-12 cell-date-picker">
          <label class="text-xs mb-1" for="date-from">Until</label>
          <date-picker id="date-until" v-model="maxDate"
                       :disabled="pending" @input="untilChanged" />
        </div>
        <div class="col-12 cell-buttons">
          <b-button variant="secondary"
                    :disabled="pending" @click="show">
            Show
          </b-button>
          <b-button variant="outline-primary"
                    :disabled="pending" @click="show">
            Filters
          </b-button>
        </div>
      </div>
    </div>

    <b-modal
      id="cancelModal"
      ref="cancelModal"
      no-fade
      centered
      static
      size="md"
      modal-class="cancel-modal"
      :ok-title="cancelTitle"
      ok-variant="danger"
      ok-only
      :ok-disabled="pending || !$refs.cancelForm || !$refs.cancelForm.flags.valid"
      :no-close-on-esc="pending"
      :no-close-on-backdrop="pending"
      :hide-header-close="pending"
      @ok.prevent="processCancel"
      @hidden="cancelModalDidHide"
    >
      <template #modal-header-close>
        <svg width="20" height="20" class="d-none d-md-block"><use xlink:href="/assets/icons/icons.svg#times"/></svg>
        <svg width="10" height="18" class="d-md-none"><use xlink:href="/assets/icons/icons.svg#arrow-left"/></svg>
      </template>
      <template #modal-title>
        {{ cancelTitle }}
      </template>
      <p class="text-md">
        Please note that the
        <span v-if="cancelRecord.noshow">No-show</span><span v-else>cancelled</span>
        status applies for the entire booking.
        You will not be able to revert this change.
      </p>
      <p class="text-md text-danger">
        Do you really want to <span v-if="!cancelRecord.noshow">cancel</span><span v-else>mark</span>
        booking ID {{ cancelRecord.id }}<span v-if="cancelRecord.noshow"> as No-show</span>?
      </p>
      <p class="form">
        <b-form-group class="m-0">
          <ValidationObserver ref="cancelForm" slim>
            <ValidatedField rules="required|max:100"
                            name="cancel-reason"
                            type="text"
                            placeholder="Reason"
                            local
                            v-model="cancelRecord.reason"
                            :disabled="pending"
            />
          </ValidationObserver>
        </b-form-group>
      </p>
    </b-modal>

    <b-modal
      id="personModal"
      no-fade
      centered
      ok-only
      ok-title="Close"
      static
      size="lg"
      modal-class="person-modal"
      @hidden="personModalDidHide"
    >
      <template #modal-header-close>
        <svg width="20" height="20" class="d-none d-md-block"><use xlink:href="/assets/icons/icons.svg#times"/></svg>
        <svg width="10" height="18" class="d-md-none"><use xlink:href="/assets/icons/icons.svg#arrow-left"/></svg>
      </template>
      <template #modal-title>
        Customer data for booking number {{ shownRecord.id }}
      </template>
      <div class="columns">
        <div class="persons">
          <div class="title">
            <span>
              <svg width="20" height="20"><use xlink:href="/assets/icons/icons.svg#map-tag"/></svg>
            </span>
            <h3>Address (Booker)</h3>
          </div>
          <p v-if="!profile(shownRecord, 'booker')"><i>No data</i></p>
          <p v-else v-for="(text, idx) in profile(shownRecord, 'booker')" :key="`bp-${idx}`">{{ text }}</p>
          <div v-if="!profile(shownRecord, 'guests')">
            <div class="title">
              <span>
                <svg width="20" height="20"><use xlink:href="/assets/icons/icons.svg#map-tag"/></svg>
              </span>
              <h3>Address (Guest)</h3>
            </div>
            <p><i>No data</i></p>
          </div>
          <div v-else v-for="(guest, idx) in profile(shownRecord, 'guests')" :key="`gp-${idx}`">
            <div class="title">
              <span>
                <svg width="20" height="20"><use xlink:href="/assets/icons/icons.svg#map-tag"/></svg>
              </span>
              <h3>Address (Guest)</h3>
            </div>
            <p v-for="(text, gidx) in guest" :key="`gp-${idx}-${gidx}`">{{ text }}</p>
          </div>
        </div>
        <div class="notes">
          <div class="title">
            <span>
              <svg width="20" height="20"><use xlink:href="/assets/icons/icons.svg#bubble-square-left"/></svg>
            </span>
            <h3>Guest Remarks</h3>
          </div>
          <p v-if="!remarks(shownRecord, 'booker')"><i>No remarks</i></p>
          <p v-else v-for="(text, idx) in remarks(shownRecord, 'booker')" :key="`br-${idx}`">{{ text }}</p>
          <div class="title">
            <span>
              <svg width="20" height="20"><use xlink:href="/assets/icons/icons.svg#bubble-square-left"/></svg>
            </span>
            <h3>Room Remarks</h3>
          </div>
          <p v-if="!remarks(shownRecord, 'room')"><i>No remarks</i></p>
          <p v-else v-for="(text, idx) in remarks(shownRecord, 'room')" :key="`rr-${idx}`">{{ text }}</p>
          <div class="title">
            <span>
              <svg width="20" height="20"><use xlink:href="/assets/icons/icons.svg#bubble-square-left"/></svg>
            </span>
            <h3>Channel Remarks</h3>
          </div>
          <p v-if="!remarks(shownRecord, 'channel')"><i>No remarks</i></p>
          <p v-else v-for="(text, idx) in remarks(shownRecord, 'channel')" :key="`cr-${idx}`">{{ text }}</p>
        </div>
      </div>
    </b-modal>

    <div class="d-md-none btn-excel-sm" v-if="loaded && !empty">
      <b-btn variant="outline-primary" class="w-100">
        Excel Download
        <svg width="11" height="14" class="ml-1"><use xlink:href="/assets/icons/icons.svg#download"/></svg>
      </b-btn>
    </div>

    <div class="list-item d-md-none" v-if="loaded && empty">
      <div class="nothing">
        There are no bookings for specified period, please select another stay period
      </div>
    </div>
    <div v-if="loaded" class="d-md-none">
      <div class="list-item" v-for="row in sortedList" :key="row.id">
        <div class="d-flex">
          <div class="nr">
            <p class="label">Qty</p>
          </div>
          <div class="flex-grow-1">
            <p class="label">Room</p>
          </div>
          <div class="dots">
            <svg width="20" height="19" class="label"><use xlink:href="/assets/icons/icons.svg#dots-h"/></svg>
          </div>
        </div>
        <div class="d-flex" v-for="ct in row.content" :key="ct.rid">
          <div class="nr">
            <p class="small">{{ ct.amt }}&nbsp;&times;</p>
          </div>
          <div class="flex-grow-1">
            <p>{{ ct.name }} (ID {{ ct.rid }})</p>
          </div>
          <div class="dots"></div>
        </div>
        <div class="d-flex">
          <div class="check">
            <p class="label">
              Check-in
              <svg width="12" height="19"><use xlink:href="/assets/icons/icons.svg#calendar"/></svg>
            </p>
            <p>{{ formatDate(row.checkin_at) }}</p>
          </div>
          <div class="check pad-left">
            <p class="label">
              Check-out
              <svg width="12" height="19"><use xlink:href="/assets/icons/icons.svg#calendar"/></svg>
            </p>
            <p>{{ formatDate(row.checkout_at) }}</p>
          </div>
        </div>
        <div>
          <p class="marker">{{ plural(row.nights, 'night') }}</p>
        </div>
        <div class="d-flex">
          <div class="w-50">
            <p class="label">Guest</p>
            <p>
              <span class="person"
                    v-b-modal.personModal
                    @click="preparePersonModal(row)">{{ row.person }}</span>
              (<span v-html="plural(row.guests.amt, 'guest', true)"></span>)
            </p>
          </div>
          <div class="flex-grow-1 pad-left">
            <p class="label">Status</p>
            <p class="small">
              <span class="status" :class="{ ok: row.ok }">
                <b-dropdown v-if="row.ok" size="sm" toggle-tag="span" variant="link" no-caret>
                  <template #button-content>
                    {{ statusText(row.type) }}
                    <svg width="13" height="24" v-if="row.ok">
                      <use xlink:href="/assets/icons/icons.svg#pencil"/>
                    </svg>
                  </template>
                  <b-dropdown-item v-b-modal.cancelModal
                                   @click="prepareCancelModal(row.id)">Cancel</b-dropdown-item>
                  <b-dropdown-item v-b-modal.cancelModal
                                   @click="prepareCancelModal(row.id, true)"
                                   :disabled="!canNoShow(row.checkin_at)">No-show</b-dropdown-item>
                </b-dropdown>
                <span v-else>{{ statusText(row.type) }}</span>
              </span>
            </p>
          </div>
          <b-popover
            v-if="remarks(row, 'booker')"
            custom-class="notes-popover"
            no-fade
            :target="`sm-notes-${row.id}`"
            triggers="focus"
            placement="bottomleft"
            container="page-reservations"
            :ref="`notes-popover-sm-${row.id}`"
          >
            <div class="note-block">
              <div class="note-header">
                <figure class="avatar"></figure>
                <span>{{ row.person }}</span>
              </div>
              <p>{{ remarks(row, 'booker')[0] }}</p>
            </div>
            <div class="note-footer">
              <b-btn size="sm" variant="outline-primary" @click="hideNotesPopover(row.id, 'sm')">Cancel</b-btn>
              <b-btn size="sm" variant="secondary">Reply</b-btn>
            </div>
          </b-popover>
          <div class="notes-cell">
            <div class="notes" tabindex="-1" :id="`sm-notes-${row.id}`">
              <svg width="25" height="25">
                <use xlink:href="/assets/icons/icons.svg#bubble-square-left"/>
              </svg>
              <span class="count" v-if="remarks(row, 'booker')">{{ row.notes }}</span>
            </div>
          </div>
        </div>
        <p class="label">Rate plan</p>
        <p v-for="ct in row.content" :key="ct.pid">
          {{ ct.name }} (ID {{ ct.pid }})
        </p>
        <div class="d-flex">
          <div class="w-50">
            <p class="label">Total price</p>
            <p class="total-price">{{ formatPrice(row.total.price, row.total.cur) }}</p>
          </div>
          <div class="w-50 pad-left">
            <p class="label">Credit card</p>
            <p class="credit-card">View details</p>
          </div>
        </div>
        <p class="label">Booking date</p>
        <p>{{ formatDate(row.created_at, true) }}</p>
        <p class="label">Channel</p>
        <p>{{ row.source.name }} (ID {{ row.source.id }})</p>
      </div>
    </div>

    <div class="list d-none d-md-block" v-if="loaded">
      <div class="nothing" v-if="empty">
        There are no bookings for specified period, please select another stay period
      </div>
      <div v-else>
        <table class="w-100">
          <thead>
            <tr>
              <th>Guest</th>
              <th class="text-nowrap">Check-in</th>
              <th class="text-nowrap">Check-out</th>
              <th class="text-right">Qty</th>
              <th>Room</th>
              <th>Rate plan</th>
              <th>Total<br>price</th>
              <th>Status</th>
              <th>Credit<br>card</th>
              <th>Booking<br>date</th>
              <th>Notes</th>
              <th class="text-right">Channel<br>Booking ID</th>
            </tr>
          </thead>
          <tbody v-for="row in sortedList" :key="row.id">
            <tr class="separator before"></tr>
            <tr>
              <td class="first" :rowspan="row.rs">
                <p><span class="person"
                         v-b-modal.personModal
                         @click="preparePersonModal(row)">{{ row.person }}</span></p>
                <p class="guests text-nowrap">
                  {{ plural(row.guests.amt, 'guest') }}
                  <span v-b-tooltip.hover.bottomright :title="guestsCount(row.guests)">
                    <svg width="14" height="14">
                      <use xlink:href="/assets/icons/icons.svg#info"/>
                    </svg>
                  </span>
                </p>
              </td>
              <td :rowspan="row.rs">
                <div class="check in">
                  <span>{{ formatDate(row.checkin_at) }}</span>
                  <span class="marker">{{ plural(row.nights, 'night') }}</span>
                </div>
              </td>
              <td :rowspan="row.rs">
                <div class="check out">
                  <span>{{ formatDate(row.checkout_at) }}</span>
                  <span class="marker"></span>
                </div>
              </td>
              <td class="nr text-right">
                {{ row.content[0].amt }}&nbsp;&times;
              </td>
              <td>
                <p>{{ row.content[0].name }}</p>
                <p class="text-nowrap">ID {{ row.content[0].rid }}</p>
              </td>
              <td>
                <p>{{ row.content[0].name }}</p>
                <p class="text-nowrap">ID {{ row.content[0].pid }}</p>
              </td>
              <td :rowspan="row.rs">
                <span class="total-price" :id="`price-${row.id}`" tabindex="0">
                  {{ formatPrice(row.total.price, row.total.cur) }}
                </span>
                <b-popover
                  :target="`price-${row.id}`"
                  triggers="focus"
                  placement="bottom"
                  container="page-reservations"
                >
                  <div v-for="(plan, idx) in row.content" :key="idx">
                    <hr v-if="idx > 0">
                    <p class="muted">{{ formatDate(plan.from) }} ~ {{ formatDate(plan.till) }}</p>
                    <p>
                      {{ plan.amt }}&nbsp;&times;&nbsp;{{ plan.name }}
                      ID {{ plan.rid }},
                      PID {{ plan.pid }}
                    </p>
                    <p>
                      <b>Total: {{ formatPrice(plan.amt * plan.price * getDays(plan), plan.cur) }}</b>
                      ({{ formatPrice(plan.price, plan.cur) }} / night)
                    </p>
                  </div>
                </b-popover>
              </td>
              <td :rowspan="row.rs">
                <span class="status" :class="{ ok: row.ok }">
                  <b-dropdown v-if="row.ok" size="sm" toggle-tag="span" variant="link" no-caret>
                    <template #button-content>
                      {{ statusText(row.type) }}
                      <svg width="13" height="12">
                        <use xlink:href="/assets/icons/icons.svg#pencil"/>
                      </svg>
                    </template>
                    <b-dropdown-item v-b-modal.cancelModal
                                     @click="prepareCancelModal(row.id)">Cancel</b-dropdown-item>
                    <b-dropdown-item v-b-modal.cancelModal
                                     @click="prepareCancelModal(row.id, true)"
                                     :disabled="!canNoShow(row.checkin_at)">No-show</b-dropdown-item>
                  </b-dropdown>
                  <span v-else>{{ statusText(row.type) }}</span>
                </span>
              </td>
              <td :rowspan="row.rs">
                <span class="credit-card">View details</span>
              </td>
              <td :rowspan="row.rs" class="booking-date" v-html="formatDate(row.created_at, true, true)"></td>
              <td :rowspan="row.rs">
                <b-popover
                  v-if="remarks(row, 'booker')"
                  custom-class="notes-popover"
                  :target="`notes-${row.id}`"
                  triggers="focus"
                  placement="bottomleft"
                  container="page-reservations"
                  :ref="`notes-popover-${row.id}`"
                >
                  <div class="note-block">
                    <div class="note-header">
                      <figure class="avatar"></figure>
                      <span>{{ row.person }}</span>
                    </div>
                    <p>{{ remarks(row, 'booker')[0] }}</p>
                  </div>
                  <div class="note-footer">
                    <b-btn size="sm" variant="outline-primary" @click="hideNotesPopover(row.id)">Cancel</b-btn>
                    <b-btn size="sm" variant="secondary">Reply</b-btn>
                  </div>
                </b-popover>
                <div class="notes" :id="`notes-${row.id}`" tabindex="-1">
                  <svg width="25" height="25">
                    <use xlink:href="/assets/icons/icons.svg#bubble-square-left"/>
                  </svg>
                  <span class="count" v-if="remarks(row, 'booker')">{{ row.notes }}</span>
                </div>
              </td>
              <td class="source last" :rowspan="row.rs">
                <p>{{ row.source.name }}</p>
                <p class="text-nowrap">ID {{ row.source.id }}</p>
              </td>
            </tr>
            <fragment v-if="row.rs > 1">
              <tr v-for="(item, idx) in row.content.slice(1)" :key="`rooms-${row.id}-${idx+1}`" class="more-items">
                <td class="nr text-right">
                  {{ item.amt }}&nbsp;&times;
                </td>
                <td>
                  <p>{{ item.name }}</p>
                  <p class="text-nowrap">ID {{ item.rid }}</p>
                </td>
                <td>
                  <p>{{ item.name }}</p>
                  <p class="text-nowrap">ID {{ item.pid }}</p>
                </td>
              </tr>
            </fragment>
            <tr class="separator after"></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import { mapState, mapGetters, mapActions } from 'vuex';

  const statuses = {
    14: 'OK',
    15: 'Cancelled',
    16: 'OK',
    18: 'No-show',
  };

  export default {
    name: 'Reservations',
    data() {
      return {
        minDate: null,
        maxDate: null,
        today: null,
        searchForItems: [
          { id: 0, text: 'Stay period' },
          { id: 1, text: 'Check in', disabled: true },
          { id: 2, text: 'Check out', disabled: true },
        ],
        searchFor: 0,
        shownRecord: {},
        cancelRecord: { reason: '' },
      };
    },
    created() {
      this.today = moment();
      this.minDate = moment();
      this.maxDate = moment().add(1, 'month');
      this.$nextTick(this.show);
    },
    computed: {
      ...mapGetters('reservations', ['loaded', 'empty']),
      ...mapState('reservations', ['error', 'pending', 'data']),

      sortedList() {
        return this.data.map((i) => {
          const item = { ...i };
          item.rs = item.content.length;
          return item;
        });
      },
      cancelTitle() {
        return this.cancelRecord.noshow ? 'Mark as No-show' : 'Cancel reservation';
      },
    },
    methods: {
      ...mapActions('reservations', ['fetchData', 'cancelReservation']),

      fromChanged(dt) {
        if (dt.isAfter(this.maxDate, 'date')) {
          this.maxDate = moment(dt);
        }
      },
      untilChanged(dt) {
        if (dt.isBefore(this.minDate, 'date')) {
          this.minDate = moment(dt);
        }
      },
      show() {
        this.fetchData({
          from: this.minDate.format('YYYY-MM-DD'),
          until: this.maxDate.format('YYYY-MM-DD'),
          search: this.searchFor,
        });
      },
      plural(value, word, nbsp = false) {
        // eslint-disable-next-line no-nested-ternary
        const s = parseInt(value, 10) !== 1 ? (word !== 'child' ? 's' : 'ren') : '';
        return `${value}${nbsp ? '&nbsp;' : ' '}${word}${s}`;
      },
      formatDate(date, time = false, multiline = false) {
        const separator = multiline ? '<br>' : ' ';
        return moment.utc(date).format(`D MMM YYYY${time ? `${separator}HH:mm:ss [GMT]` : ''}`);
      },
      formatPrice(amount, currency) {
        return `${amount.toFixed(2).replace('.00', '')} ${currency.toUpperCase()}`;
      },
      getDays(plan) {
        return moment(plan.till).diff(moment(plan.from), 'days');
      },
      statusText(status) {
        return statuses[status];
      },
      canNoShow(checkin) {
        return moment.utc(checkin).isSameOrBefore(moment.utc());
      },
      guestsCount(guests) {
        const parts = [];
        if (guests.adl > 0) parts.push(this.plural(guests.adl, 'adult'));
        if (guests.cld > 0) parts.push(this.plural(guests.cld, 'child'));
        return parts.join(' and ');
      },
      remarks(record, type) {
        if (!record || !record.remarks) return false;
        const ret = record.remarks[type];
        return Array.isArray(ret) && ret.length ? ret : false;
      },
      profile(record, type) {
        if (!record || !record.profiles) return false;
        const ret = record.profiles[type];
        return Array.isArray(ret) && ret.length ? ret : false;
      },
      hideNotesPopover(id, suffix = false) {
        const ref = `notes-popover${suffix ? `-${suffix}` : ''}-${id}`;
        this.$refs[ref][0].$emit('close');
      },
      preparePersonModal(row) {
        this.shownRecord = row;
      },
      personModalDidHide() {
        this.shownRecord = {};
      },
      prepareCancelModal(id, noshow = false) {
        this.$refs.cancelForm.reset();
        this.cancelRecord = { id, noshow, reason: '' };
      },
      cancelModalDidHide() {
        this.cancelRecord = { reason: '' };
      },
      async processCancel() {
        const { id, reason, noshow } = this.cancelRecord;
        try {
          await this.cancelReservation({ id, reason, noshow });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e.message);
        }
        this.$refs.cancelModal.hide();
      },
    },
  };
</script>
