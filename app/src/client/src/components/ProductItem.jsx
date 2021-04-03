import React from "react";

const ProductItem = props => {
  const { product } = props;

  //Heat
  var heatString = ''
  let numberOfPeppers = Math.round(parseFloat(product.heat/20))
  for (var i=0; i < numberOfPeppers; i++) {
    heatString += "🌶️"
  }

  //Ingredients
  var ingredientsString = product.ingredients.map(function(item) { return item.ingredient }).join(', ')
  
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-128x128">
              <img
                src={product.imageUrl}
                alt={product.name}
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.name}{" "}
              <span className="tag is-primary">${product.price || 'TBD'}</span>
            </b>
            <div>{heatString}</div>
            <div>{ingredientsString}</div>
            {product.stock > 0 ? (
              <small>{product.stock + " Available"}</small>
            ) : (
              <small className="has-text-danger">Out Of Stock</small>
            )}
            <div className="is-clearfix">
              {product.stock > 0 ? (
                <button
                className="button is-small is-outlined is-primary   is-pulled-right"
                onClick={() => {
                    if(document.getElementsByClassName('Collapsible__trigger is-closed').length > 0){
                      document.getElementsByClassName('Collapsible__trigger')[0].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
                    }

                    var elmnt = document.getElementsByClassName('Collapsible__trigger')[0]
                    elmnt.scrollIntoView();
                  }}
              >
                Request Now
              </button>
              ) : (<div></div>)}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;