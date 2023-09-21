class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="header-area clearfix">
            <!-- Close Icon -->
            <div class="nav-close">
                <i class="fa fa-close" aria-hidden="true"></i>
            </div>
            <!-- Logo -->
            <div class="logo">
                <a href="index.html"><img src="img/core-img/logo.png" alt=""></a>
            </div>
            <!-- Amado Nav -->
            <nav class="amado-nav">
                <ul>
                    <li class="nav-link"><a href="index.html">Home</a></li>
                    <li class="nav-link"><a href="shop.html">Shop</a></li>
                    <li class="nav-link"><a href="product-details.html">Product</a></li>
                    <li class="nav-link"><a href="cart.html">Cart</a></li>
                    <li class="nav-link"><a href="checkout.html">Checkout</a></li>
                    <span class="not_logged_in">
                    <li class="nav-link"><a href="login.html">Sign In</a></li>
                    <li class="nav-link"><a href="signup.html">Register</a></li>
                    </span>
                    <span class="logged_in d-none">
                    <li class="nav-link"><a href="#">Dashboard</a></li>
                    </span>
                </ul>
            </nav>
            <!-- Button Group -->
            <div class="amado-btn-group mt-30 mb-100">
                <a href="#" class="btn amado-btn mb-15">%Discount%</a>
                <a href="#" class="btn amado-btn active">New this week</a>
            </div>
            <!-- Cart Menu -->
            <div class="cart-fav-search mb-100">
                <a href="cart.html" class="cart-nav"><img src="img/core-img/cart.png" alt=""> Cart <span>(0)</span></a>
                <a href="#" class="fav-nav"><img src="img/core-img/favorites.png" alt=""> Favourite</a>
                <a href="#" class="search-nav"><img src="img/core-img/search.png" alt=""> Search</a>
            </div>
            <!-- Social Button -->
            <div class="social-info d-flex justify-content-between">
                <a href="#"><i class="fa fa-pinterest" aria-hidden="true"></i></a>
                <a href="#"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                <a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                <a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a>
            </div>
        </header>
        `;
  }
}

class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer class="footer_area clearfix">
      <div class="container">
        <div class="row align-items-center">
          <!-- Single Widget Area -->
          <div class="col-12 col-lg-4">
            <div class="single_widget_area">
              <!-- Logo -->
              <div class="footer-logo mr-50">
                <a href="index.html"
                  ><img src="img/core-img/logo2.png" alt=""
                /></a>
              </div>
              <!-- Copywrite Text -->
              <p class="copywrite">
                <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
                Copyright &copy;
                <script>
                  document.write(new Date().getFullYear());
                </script>
                All rights reserved | This template is made with
                <i class="fa fa-heart-o" aria-hidden="true"></i> by
                <a href="https://colorlib.com" target="_blank">Colorlib</a> &
                Re-distributed by
                <a href="https://themewagon.com/" target="_blank">Themewagon</a>
                <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
              </p>
            </div>
          </div>
          <!-- Single Widget Area -->
          <div class="col-12 col-lg-8">
            <div class="single_widget_area">
              <!-- Footer Menu -->
              <div class="footer_menu">
                <nav class="navbar navbar-expand-lg justify-content-end">
                  <button
                    class="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#footerNavContent"
                    aria-controls="footerNavContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <i class="fa fa-bars"></i>
                  </button>
                  <div class="collapse navbar-collapse" id="footerNavContent">
                    <ul class="navbar-nav ml-auto">
                      <li class="nav-item active">
                        <a class="nav-link" href="index.html">Home</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="shop.html">Shop</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="product-details.html"
                          >Product</a
                        >
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="cart.html">Cart</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="checkout.html">Checkout</a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
        `;
  }
}

customElements.define("app-footer", Footer);
customElements.define("app-header", Header);
