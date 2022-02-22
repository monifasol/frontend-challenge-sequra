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

  // event that will be triggered
  const priceChangedEvent = new Event('pricechanged', {
      bubbles: false,
      cancelable: true,
      composed: false
  })
  
  const priceElement = document.querySelector('#product-price');
  const totalPriceElement = document.querySelector('[data-total-price]');

  const getPrice = (priceString) => {
    const priceValue = priceString.slice(0, priceString.indexOf(' ')).replace(',', '.');
    const priceNumber = parseFloat(priceValue).toFixed(2);
    return priceNumber;
  }
  
  const updateTotalPrice = () => {
    // quantity changed!

    const priceString = document.querySelector(".attr2.active").dataset.price;
    const originalPrice = getPrice(priceString);

    const productQuantity = document.querySelector("#productQuantity").value;
    const total = (originalPrice * parseInt(productQuantity)).toFixed(2).toString().replace('.', ',');

    totalPriceElement.textContent = `${total} €`;
    updatePriceWidget();
  }
  
  const updatePriceWidget = () => {

    // Since the price changed, I dispatch the event from my widget element
    const widgetElement = document.querySelector("[data-total-with-tax]");
    widgetElement.dispatchEvent(priceChangedEvent);

    // update widget totalWithTax, so that the widget will be able to read the new price
    widgetElement.dataset.totalWithTax = getPrice(totalPriceElement.textContent) * 100;
  }
  
  // I init total price with the product price
  totalPriceElement.textContent = priceElement.textContent;

  updatePriceWidget();
      
});
