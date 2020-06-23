<template>
  <fragment>
    <img v-if="!asLoggedIn" src="/assets/images/sidenav.jpg" alt="Sidenav">
    <ul v-else class="sidenav-menu">
      <!--
      <router-link :to="{ name: 'home' }" exact class="sidenav-menu-item" tag="li">
        <a>
          <svg class="icon" width="17" height="17" viewBox="0 0 17 17">
            <use xlink:href="/assets/icons/icons.svg#dashboard"/>
          </svg>
          <span>Dashboard</span>
        </a>
      </router-link>
      -->
      <router-link to="/reservations" class="sidenav-menu-item" tag="li">
        <a>
          <svg class="icon" width="19" height="21" viewBox="0 0 19 21">
            <use xlink:href="/assets/icons/icons.svg#reservations"/>
          </svg>
          <span>Reservations</span>
        </a>
      </router-link>
      <router-link to="/calendar" tag="li"
                   class="sidenav-menu-item sidenav-menu-item-dropdown"
      >
        <a>
          <svg class="icon" width="19" height="19" viewBox="0 0 19 19">
            <use xlink:href="/assets/icons/icons.svg#calendar"/>
          </svg>
          <span>Calendar</span>
          <!--
          <svg class="arrow" stroke-width="2" width="12" height="7" viewBox="0 0 12 7">
            <use xlink:href="/assets/icons/icons.svg#arrow-down"/>
          </svg>
          -->
        </a>
        <!--
        <ul class="sidenav-menu-dropdown">
          <router-link to="/calendar/quickupdate" class="sidenav-menu-item" tag="li">
            <a>
              <svg class="icon" width="5" height="5" viewBox="0 0 5 5">
                <use xlink:href="/assets/icons/icons.svg#dot"/>
              </svg>
              <span>Quick Update</span>
            </a>
          </router-link>
          <router-link to="/calendar/settings" class="sidenav-menu-item" tag="li">
            <a href="#">
              <svg class="icon" width="5" height="5" viewBox="0 0 5 5">
                <use xlink:href="/assets/icons/icons.svg#dot"/>
              </svg>
              <span>Settings</span>
            </a>
          </router-link>
        </ul>
        -->
      </router-link>
      <!--
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="19" height="19" viewBox="0 0 19 19">
            <use xlink:href="/assets/icons/icons.svg#color-customization"/>
          </svg>
          <span>Color customization</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="20" height="19" viewBox="0 0 20 19">
            <use xlink:href="/assets/icons/icons.svg#email-customization"/>
          </svg>
          <span>Email customization</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="12" height="15" viewBox="0 0 12 15">
            <use xlink:href="/assets/icons/icons.svg#text-customization"/>
          </svg>
          <span>Text customization</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="20" height="16" viewBox="0 0 20 16">
            <use xlink:href="/assets/icons/icons.svg#translation-tool"/>
          </svg>
          <span>Translation tool</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="22" height="22" viewBox="0 0 22 22">
            <use xlink:href="/assets/icons/icons.svg#blank-circle"/>
          </svg>
          <span>Payment provider</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="22" height="22" viewBox="0 0 22 22">
            <use xlink:href="/assets/icons/icons.svg#blank-circle"/>
          </svg>
          <span>Picture administation</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="22" height="22" viewBox="0 0 22 22">
            <use xlink:href="/assets/icons/icons.svg#blank-circle"/>
          </svg>
          <span>File administration</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="22" height="22" viewBox="0 0 22 22">
            <use xlink:href="/assets/icons/icons.svg#blank-circle"/>
          </svg>
          <span>Property details</span>
        </a>
      </li>
      <li
        class="sidenav-menu-item sidenav-menu-item-dropdown"
        :class="{
          open: expandRooms
        }"
      >
        <a
          href="#"
          @click="expandRooms = !expandRooms"
        >
          <svg class="icon" width="22" height="22" viewBox="0 0 22 22">
            <use xlink:href="/assets/icons/icons.svg#blank-circle"/>
          </svg>
          <span>Rooms & Rates</span>
          <svg class="arrow" stroke-width="2" width="12" height="7" viewBox="0 0 12 7">
            <use xlink:href="/assets/icons/icons.svg#arrow-down"/>
          </svg>
        </a>
        <ul class="sidenav-menu-dropdown">
          <li class="sidenav-menu-item">
            <a href="#">
              <svg class="icon" width="5" height="5" viewBox="0 0 5 5">
                <use xlink:href="/assets/icons/icons.svg#dot"/>
              </svg>
              <span>Quick Update</span>
            </a>
          </li>
          <li class="sidenav-menu-item">
            <a href="#">
              <svg class="icon" width="5" height="5" viewBox="0 0 5 5">
                <use xlink:href="/assets/icons/icons.svg#dot"/>
              </svg>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="22" height="22" viewBox="0 0 22 22">
            <use xlink:href="/assets/icons/icons.svg#blank-circle"/>
          </svg>
          <span>Distributors</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="22" height="22" viewBox="0 0 22 22">
            <use xlink:href="/assets/icons/icons.svg#blank-circle"/>
          </svg>
          <span>Invoice archive</span>
        </a>
      </li>
      <li class="sidenav-menu-item">
        <a href="#">
          <svg class="icon" width="22" height="22" viewBox="0 0 22 22">
            <use xlink:href="/assets/icons/icons.svg#blank-circle"/>
          </svg>
          <span>Logging</span>
        </a>
      </li>
      <li class="sidenav-menu-item sidenav-menu-item-dropdown"
          :class="{ open: expandUA }"
      >
        <a
          href="#"
          @click="expandUA = !expandUA"
        >
          <svg class="icon" width="23" height="15" viewBox="0 0 23 15">
            <use xlink:href="/assets/icons/icons.svg#user-group"/>
          </svg>
          <span>Users & Access</span>
          <svg class="arrow" stroke-width="2" width="12" height="7" viewBox="0 0 12 7">
            <use xlink:href="/assets/icons/icons.svg#arrow-down"/>
          </svg>
        </a>
        <ul class="sidenav-menu-dropdown">
          <li class="sidenav-menu-item">
            <a href="#">
              <svg class="icon" width="5" height="5" viewBox="0 0 5 5">
                <use xlink:href="/assets/icons/icons.svg#dot"/>
              </svg>
              <span>Quick Update</span>
            </a>
          </li>
          <li class="sidenav-menu-item">
            <a href="#">
              <svg class="icon" width="5" height="5" viewBox="0 0 5 5">
                <use xlink:href="/assets/icons/icons.svg#dot"/>
              </svg>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </li>
      -->
    </ul>
  </fragment>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'SideNav',
    // data: () => ({
    //   expandCalendar: false,
    //   expandRooms: false,
    //   expandUA: false,
    // }),
    computed: {
      ...mapGetters('user', ['loggedIn']),
      ...mapGetters(['centered']),
      asLoggedIn() {
        return this.loggedIn && !this.centered;
      },
    },
  };
</script>
