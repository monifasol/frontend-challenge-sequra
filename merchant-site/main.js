$(document).ready(function() {

  $("ul.menu-items > li").on("click", function() {
    $("ul.menu-items > li").removeClass("active");
    $(this).addClass("active");
  });

  $(".attr,.attr2").on("click", function() {
    var clase = $(this).attr("class");

    $("." + clase).removeClass("active");
    $(this).addClass("active");
    $("#product-price").html($(this).attr("data-price"));
    updatePriceWidget();
  });

  $(".btn-minus").on("click", function() {
    var now = $(".section > div > input").val();
    if ($.isNumeric(now)) {
      if (parseInt(now) - 1 > 0) {
        now--;
      }
      $(".section > div > input").val(now);
    } else {
      $(".section > div > input").val("1");
    }
    updateTotalPrice();
  });

  $(".btn-plus").on("click", function() {
    var now = $(".section > div > input").val();
    if ($.isNumeric(now)) {
      $(".section > div > input").val(parseInt(now) + 1);
    } else {
      $(".section > div > input").val("1");
    }
    updateTotalPrice();
  });

  const priceElement = document.querySelector("#product-price")

  const getPrice = (price) => {
    const priceValue = price.slice(0, price.indexOf(' ')).replace(',', '.')
    const priceNumber = parseFloat(priceValue).toFixed(2)
    return priceNumber
  }
  
  const updateTotalPrice = () => {
    const originalPrice = getPrice(document.querySelector(".attr2.active").dataset.price)

    const productQuantity = document.querySelector("#productQuantity").value
    const total = (originalPrice * parseInt(productQuantity)).toFixed(2).toString().replace('.', ',')

    priceElement.textContent = `${total} €`
    updatePriceWidget();
  }
  
  const updatePriceWidget = () => {
    const widgetElement = document.querySelector("[data-total-with-tax]")
    widgetElement.dataset.totalWithTax = getPrice(priceElement.textContent) * 100
  }
  
  updatePriceWidget()

});
