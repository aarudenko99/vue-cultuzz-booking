<template>
  <fragment>
    <nav class="navbar d-md-none">
      <a href="#" class="position-absolute d-lg-none">
        <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="25" height="2" fill="white"/>
          <rect y="7" width="25" height="2" fill="white"/>
          <rect y="14" width="25" height="2" fill="white"/>
        </svg>
      </a>
      <router-link class="navbar-brand p-0 mx-auto" :to="{ name:'home' }">
        <svg class="logo" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.8421 6.79683C23.0149 6.07761 21.6484 4.92685 20.4257 3.84801C19.9223 3.38051 19.4548 3.12878 18.9513 3.12878C17.9804 3.12878 16.9375 3.95589 16.1104 4.71108C17.4769 5.8978 20.2459 8.27125 21.6125 9.45797C22.5115 10.2132 22.5834 10.7885 22.5834 11.4358V17.5133C22.5834 18.9517 21.3967 20.1385 19.9582 20.1385H10.3206C8.88217 20.1385 7.69545 18.9517 7.69545 17.5133V12.8743C7.19199 13.2699 6.54469 13.5216 5.82546 13.5216C5.25008 13.5216 4.71066 13.3418 4.24316 13.0901V17.4773C4.24316 20.8217 6.97622 23.5548 10.3206 23.5548H19.9223C23.2667 23.5548 25.9997 20.8217 25.9997 17.4773V11.3999C25.9997 10.1053 25.748 8.41509 23.8421 6.79683Z"
                class="shape"/>
          <path d="M13.4495 4.53112C13.5214 4.4592 13.6293 4.35131 13.7732 4.20747C14.5643 3.38036 15.8949 1.97787 17.4772 1.43845C17.3333 1.29461 17.2254 1.15076 17.0816 1.00692L16.9737 0.934993C16.3624 0.395574 15.6072 0 14.5643 0C13.1259 0 12.4066 0.683264 11.5436 1.5823L5.71784 7.51591C5.60996 7.40802 5.46611 7.30014 5.35823 7.19225C5.28631 7.12033 5.21438 7.04841 5.14246 7.01245C5.1065 6.97649 5.07054 6.94053 5.03458 6.90456C3.59613 5.71784 1.7621 5.60996 0 7.30014C1.33057 8.23513 3.12863 9.78147 4.56708 11.184C4.89073 11.5076 5.32227 11.6874 5.78976 11.6874C6.25726 11.6874 6.6888 11.5076 7.01245 11.184L13.4495 4.53112Z"
                fill="#F7981C"/>
        </svg>
      </router-link>
      <b-dropdown v-if="asLoggedIn && hotelRegistered"
                  size="sm" toggle-tag="div"
                  toggle-class="navbar-id-dropdown" variant="link" no-caret right>
        <template #button-content>
          <span>ID {{ hotelID }}</span>
        </template>
        <b-dropdown-item @click.prevent="logout">Log out</b-dropdown-item>
      </b-dropdown>
    </nav>

    <div class="d-flex">
      <div class="sidenav d-none" :class="{'d-md-block': sidebar, 'closed': collapsed}">
        <nav class="sidenav-header d-none d-md-flex align-items-center">
          <router-link class="p-0 mx-auto ml-sm-0" :to="{ name:'home' }">
            <svg class="logo" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.8421 6.79683C23.0149 6.07761 21.6484 4.92685 20.4257 3.84801C19.9223 3.38051 19.4548 3.12878 18.9513 3.12878C17.9804 3.12878 16.9375 3.95589 16.1104 4.71108C17.4769 5.8978 20.2459 8.27125 21.6125 9.45797C22.5115 10.2132 22.5834 10.7885 22.5834 11.4358V17.5133C22.5834 18.9517 21.3967 20.1385 19.9582 20.1385H10.3206C8.88217 20.1385 7.69545 18.9517 7.69545 17.5133V12.8743C7.19199 13.2699 6.54469 13.5216 5.82546 13.5216C5.25008 13.5216 4.71066 13.3418 4.24316 13.0901V17.4773C4.24316 20.8217 6.97622 23.5548 10.3206 23.5548H19.9223C23.2667 23.5548 25.9997 20.8217 25.9997 17.4773V11.3999C25.9997 10.1053 25.748 8.41509 23.8421 6.79683Z"
                    class="shape"/>
              <path d="M13.4495 4.53112C13.5214 4.4592 13.6293 4.35131 13.7732 4.20747C14.5643 3.38036 15.8949 1.97787 17.4772 1.43845C17.3333 1.29461 17.2254 1.15076 17.0816 1.00692L16.9737 0.934993C16.3624 0.395574 15.6072 0 14.5643 0C13.1259 0 12.4066 0.683264 11.5436 1.5823L5.71784 7.51591C5.60996 7.40802 5.46611 7.30014 5.35823 7.19225C5.28631 7.12033 5.21438 7.04841 5.14246 7.01245C5.1065 6.97649 5.07054 6.94053 5.03458 6.90456C3.59613 5.71784 1.7621 5.60996 0 7.30014C1.33057 8.23513 3.12863 9.78147 4.56708 11.184C4.89073 11.5076 5.32227 11.6874 5.78976 11.6874C6.25726 11.6874 6.6888 11.5076 7.01245 11.184L13.4495 4.53112Z"
                    fill="#F7981C"/>
            </svg>
          </router-link>
          <a href="#" v-if="asLoggedIn" @click.prevent="collapsed = !collapsed">
            <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="25" height="2" fill="white"/>
              <rect y="7" width="25" height="2" fill="white"/>
              <rect y="14" width="25" height="2" fill="white"/>
            </svg>
          </a>
        </nav>
        <side-nav/>
      </div>
      <div class="content"
           :class="{ 'no-navbar': !sidebar, 'bg-light': asLoggedIn, 'logged-in': asLoggedIn, 'nosidebar': collapsed }">
        <div class="profile d-none d-md-flex align-items-center justify-content-end"
             v-if="asLoggedIn && hotelRegistered">
          <span>{{ hotelName }}</span>
          <div class="separator"></div>
          <span class="text-primary mr-2">ID {{ hotelID }}</span>
          <b-dropdown size="sm" toggle-tag="div" toggle-class="profile-menu" variant="link" no-caret right>
            <template #button-content>
              <svg stroke-width="2" width="12" height="7" viewBox="0 0 12 7">
                <use xlink:href="/assets/icons/icons.svg#arrow-down"/>
              </svg>
            </template>
            <b-dropdown-item @click.prevent="logout">Log out</b-dropdown-item>
          </b-dropdown>
        </div>
        <main
          :class="asLoggedIn?'logged-in':'d-flex align-items-sm-center justify-content-center flex-grow-1'">
          <router-view/>
          <b-modal
            id="expiredModal"
            ref="expiredModal"
            modal-class="session-expired-modal"
            no-fade
            static
            centered
            hide-header
            size="sm"
            ok-title="Reload page"
            ok-variant="danger"
            ok-only
            no-close-on-backdrop
            no-close-on-esc
            hide-header-close
            @ok.prevent="reload"
            title="Session expired"
          >
            <h5 class="text-danger">Your session has expired</h5>
            <p>Please, reload page and login again.</p>
          </b-modal>
        </main>
        <footer class="d-none" :class="{ 'd-sm-block': !asLoggedIn }">
          <ul class="footer-menu">
            <li><a href="https://www.cultbooking.com/en/" target="_blank">Home</a></li>
            <li><a href="https://www.cultbooking.com/en/#benefits" target="_blank">Benefits</a></li>
            <li><a href="https://www.cultbooking.com/en/highlights/" target="_blank">Highlights</a></li>
            <li><a href="https://www.cultbooking.com/en/developers-connect/" target="_blank">Developers connect</a></li>
            <li><a href="https://www.cultbooking.com/en/price/" target="_blank">Price</a></li>
          </ul>
        </footer>
      </div>
    </div>
  </fragment>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import SideNav from '@/components/SideNav.vue';

  export default {
    name: 'App',
    components: { SideNav },
    data() {
      return {
        collapsed: false,
      };
    },
    computed: {
      ...mapGetters(['pageTitle', 'sidebar', 'centered']),
      ...mapGetters('user', ['hotelRegistered', 'hotelName', 'hotelID', 'loggedIn', 'sessionExpired']),
      asLoggedIn() {
        return this.loggedIn && !this.centered;
      },
    },
    watch: {
      pageTitle() {
        this.updateTitle();
      },
      sessionExpired(yes) {
        if (yes) {
          this.$refs.expiredModal.show();
        } else {
          this.$refs.expiredModal.hide();
        }
      },
    },
    methods: {
      ...mapActions('auth', ['logout']),

      updateTitle() {
        document.querySelector('head title').textContent = `CultBooking - ${this.pageTitle}`;
      },
      reload() {
        this.logout({ forced: true, stay: true });
      },
    },
  };
</script>
