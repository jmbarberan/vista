<template>
  <nav class="navbar fixed-top">
    <div class="d-flex align-items-center navbar-left">
      <a
        href="#"
        class="menu-button d-none d-md-block"
        @click.prevent.stop="changeSideMenuStatus({step :menuClickCount+1,classNames:menuType,selectedMenuHasSubItems})"
      >
        <menu-icon />
      </a>
      <a
        href="#"
        class="menu-button-mobile d-xs-block d-sm-block d-md-none"
        @click.prevent.stop="changeSideMenuForMobile(menuType)"
      >
        <mobile-menu-icon />
      </a>
    </div>
    <logo style="width: 48px; height: 44px"/>
    <div class="navbar-right">
      <div class="header-icons d-inline-block align-middle">
        <!-- Pantalla completa -->
        <div class="position-relative d-none d-sm-inline-block">
          <div class="btn-group">
            <b-button variant="empty" class="header-icon btn-sm" @click="toggleFullScreen" title="Ver a pantalla completa">
              <i
                :class="{'d-inline-block':true,'simple-icon-size-actual':fullScreen,'simple-icon-size-fullscreen':!fullScreen }"
              />
            </b-button>
          </div>
        </div>
      </div>      
      <div class="position-relative d-inline-block mr-4">
          <b-dropdown
            variant="empty"
            size="sm"
            right
            toggle-class="header-icon notificationButton"
            menu-class="position-absolute mt-3"
            title="Cambiar tema de color"
            no-caret
          >
            <template slot="button-content">
              <i class="simple-icon-drop"/>
            </template>
            <template slot="default">
              <b-dropdown-form>
                <color-switcher/>
              </b-dropdown-form>  
            </template>
          </b-dropdown>
      </div>
      <!-- Menu perfil de Usuario -->
      <div class="user d-inline-block">
        <b-dropdown
          class="dropdown-menu-right"
          right
          variant="empty"
          toggle-class="p-0"
          menu-class="mt-3"
          no-caret
        >
          <template slot="button-content">
            <span v-if="currentUser != undefined" class="name mr-2 mt-2">{{ currentUser.codigo }}</span>
            <span>
              <img v-if="subImage.length > 0" :alt="currentUser.codigo" :src="subImage" />
              <b-avatar v-else variant="primary" :text="traerIniciales(currentUser.nombres)" class="border-0 ml-0 mr-4 align-self-top"></b-avatar>
            </span>
          </template>
          <b-dropdown-item>{{ $t("vista.comandos.cambiar-clave") }}</b-dropdown-item>
          <b-dropdown-item @click="logout">{{ $t("vista.comandos.cerrar-sesion") }}</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="salir">{{ $t("vista.comandos.salir") }}</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { MenuIcon, MobileMenuIcon, Logo } from "../../components/Svg";
import { getDirection, setDirection, getThemeColor, setThemeColor, getCurrentUser, getCurrentSubscriber } from "../../utils";
import ColorSwitcher from '../../components/Common/ColorSwitcher.vue';
import { localeOptions } from "../../constants/config";

export default {
  components: {
    "menu-icon": MenuIcon,
    "mobile-menu-icon": MobileMenuIcon,
    "logo": Logo,
    "color-switcher": ColorSwitcher
  },
  data() {
    return {
      fullScreen: false,
      localeOptions,
      isDarkActive: false,
    };
  },
  methods: {
    ...mapMutations(["changeSideMenuStatus", "changeSideMenuForMobile"]),
    ...mapActions(["setLang", "signOut", "exitSubscriberAccount"]),
    changeLocale(locale, direction) {
      const currentDirection = getDirection().direction;
      if (direction !== currentDirection) {
        setDirection(direction);
      }
      this.setLang(locale);
    },
    logout() {
      this.signOut().then(() => {
        this.$router.push("/usuario/acceder");
      });
    },
    salir() {
      this.exitSubscriberAccount().then(() => {
        this.$router.push("/bienvenido");
      });
    },
    traerIniciales(txt) {
      if (txt != null) {
        if (txt.indexOf(" ") > 0) {
          return txt
            .split(" ")
            .map(item => item.charAt(0))
            .slice(0, 2)
            .join("");
        } else {
          return txt.substring(0,2);
        }
      }
    },
    toggleFullScreen() {
      const isInFullScreen = this.isInFullScreen();

      var docElm = document.documentElement;
      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      this.fullScreen = !isInFullScreen;
    },
    isInFullScreen() {
      return (
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null)
      );
    }
  },
  computed: {
    ...mapGetters({
      menuType: "getMenuType",
      menuClickCount: "getMenuClickCount",
      selectedMenuHasSubItems: "getSelectedMenuHasSubItems"
    }),
    currentUser: {
      get: function() {
        return getCurrentUser();
      }
    },
    subImage: {
      get: function() {
        let ret =  getCurrentSubscriber().logo ? getCurrentSubscriber().logo : "";
        return ret;
      }
    }
  },
  created() {
    const color = getThemeColor();
    this.isDarkActive = color.indexOf("dark") > -1;
  },
  watch: {
    "$i18n.locale"(to, from) {
      if (from !== to) {
        this.$router.go(this.$route.path);
      }
    },
    isDarkActive(val) {
      let color = getThemeColor();
      let isChange = false;
      if (val && color.indexOf("light") > -1) {
        isChange = true;
        color = color.replace("light", "dark");
      } else if (!val && color.indexOf("dark") > -1) {
        isChange = true;
        color = color.replace("dark", "light");
      }
      if (isChange) {
        setThemeColor(color);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
  }
};
</script>
