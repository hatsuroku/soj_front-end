<template>
	<v-app id='mainpage'>
        <v-app-bar
          app
          clipped-right
          color="light-blue darken-3"
          dark
        >
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <v-toolbar-title>SOJ</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
              <v-btn text link :to="{ name: 'problemSet' }">题库</v-btn>
              <v-btn text link :to="{ name: 'contestSet', params: { pid: 1 }}">比赛</v-btn>
              <v-btn text link :to="{ name: 'normalSubmitRes' }">提交查询</v-btn>

              <v-btn text link :to="{ name: 'login' }" v-if="!is_signed_in">登录</v-btn>
              <v-menu
                      v-model="show_logout_menu"
                      :close-on-content-click="false"
                      :nudge-width="300"
                      offset-y
                      v-if="is_signed_in"
              >
                  <template v-slot:activator="{ on }">
                      <v-btn
                              text
                              v-on="on"
                      >
                          注销
                      </v-btn>
                  </template>
                  <v-card>
                      <v-card-title class="headline">注销</v-card-title>
                      <v-card-text>是否真的要注销?</v-card-text>
                      <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                                  color="blue darken-2"
                                  text
                                  @click="show_logout_menu = false"
                          >
                              否
                          </v-btn>

                          <v-btn
                                  color="blue darken-2"
                                  text
                                  @click="mylogout()"
                          >
                              是
                          </v-btn>
                      </v-card-actions>
                  </v-card>
              </v-menu>
          </v-toolbar-items>
        </v-app-bar>
        
		<v-navigation-drawer
		  v-model="drawer"
          disable-resize-watcher
          disable-route-watcher
		  app
		>
		  <v-list dense>
		    <v-list-item>
		      <v-list-item-action>
		        <v-icon>mdi-account-circle</v-icon>
		      </v-list-item-action>
              <v-list-item-content v-if="is_signed_in">
                <v-list-item-title>{{username}}</v-list-item-title>
              </v-list-item-content>
		      <v-list-item-content v-if="!is_signed_in" @click="mylogin">
		        <v-list-item-title>登录</v-list-item-title>
		      </v-list-item-content>
		    </v-list-item>
		  </v-list>
		</v-navigation-drawer>
        
        <v-content>
            <!-- 显示不同页面的地方 -->
            <router-view></router-view>
        </v-content>
        
        <v-footer
         class='font-weight-medium'
        >
            <v-col
             class='text-center'
             cols='12'
            >
                2020 - {{new Date().getFullYear()}} - <strong>SOJ</strong>
            </v-col>
            
        </v-footer>
	</v-app>
</template>

<script>
	import router from "../router";

    export default {
        data : function () {
            return {
                // 用于控制页面元素
                drawer: false,
                show_logout_menu: false,

                // 页面数据
                username: null,
                is_signed_in: false,
            }
        },
        methods : {
            mylogin: function() {
                router.push("login");
            },
            mylogout: function() {
                let thisCom = this;
                $.ajax({
                    type: "POST",
                    url: thisCom.serveUrl() + "/api/user/logout/",

                    success: function(result) {
                        router.go(0);
                    },
                    error: function(e) {
                        console.error(e.status);
                        console.error(e.responseText);
                    },
                });
            },
            corss_domain_setup: function() {
                // 用于跨域
                let csrftoken = this.getCookie('csrftoken');

                $.ajaxSetup({
                    beforeSend: function(xhr, settings) {
                        // && !this.crossDomain
                        if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) ) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                    },
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                });
            },
            check_is_login: function() {
                this.corss_domain_setup();
                let global_info = this.signInGlobalInfo();
                this.is_signed_in = global_info.is_signed_in;
                this.username = global_info.username;
            }
        },
        beforeMount() {
            this.check_is_login();
        },
        beforeRouteUpdate(to, from, next) {
            this.check_is_login();
            next();
        }
    }
</script>

<style scoped>
	a {
        text-decoration: none;
        color: white;
    }

    #logout_dialog {
        position: absolute;
        top: 10px;
        right: 20px;
    }
</style>