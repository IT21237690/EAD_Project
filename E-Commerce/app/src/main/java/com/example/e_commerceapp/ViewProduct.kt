package com.example.e_commerceapp

import android.content.Context
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.util.Base64
import android.graphics.BitmapFactory
import android.widget.Button
import android.widget.Toast
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ViewProduct : AppCompatActivity() {

    private lateinit var imageView: ImageView
    private lateinit var itemNameTextView: TextView
    private lateinit var itemPriceTextView: TextView
    private lateinit var itemDescriptionTextView: TextView
    private lateinit var addToCart: ImageView
    private lateinit var quantityTextView: TextView
    private lateinit var increaseQuantityIcon: ImageView
    private lateinit var purchaseButton: Button
    private var quantity = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_product)

        imageView = findViewById(R.id.imageView9)
        itemNameTextView = findViewById(R.id.ItemName)
        itemPriceTextView = findViewById(R.id.ItemPrice)
        itemDescriptionTextView = findViewById(R.id.ItemDescription)
        addToCart = findViewById(R.id.addToCartButton)
        quantityTextView = findViewById(R.id.quantityTextView)
        increaseQuantityIcon = findViewById(R.id.increaseQuantityIcon)
        purchaseButton = findViewById(R.id.Purchasebutton)

        quantityTextView.text = quantity.toString()

        increaseQuantityIcon.setOnClickListener {
            quantity++
            quantityTextView.text = quantity.toString()
        }

        val productId = intent.getStringExtra("PRODUCT_ID")
        Log.d("ViewProduct", "Received product ID: $productId")

        // Add product to cart
        addToCart.setOnClickListener {
            if (productId != null) {
                addToCart(productId)
            }
        }

        // Place order
        purchaseButton.setOnClickListener {
            if (productId != null) {
                placeOrder(productId, quantity)
            }
        }

        if (productId != null) {
            fetchProductDetails(productId)
        }
    }

    private fun fetchProductDetails(productId: String) {
        val apiService = RetrofitInstance.api
        apiService.getProductById(productId).enqueue(object : Callback<Product> {
            override fun onResponse(call: Call<Product>, response: Response<Product>) {
                if (response.isSuccessful && response.body() != null) {
                    val product = response.body()!!
                    updateUI(product)
                    Log.d("ViewProduct", "Product details fetched successfully")
                } else {
                    Log.e("ViewProduct", "Error: ${response.code()} - ${response.message()}")
                    Toast.makeText(this@ViewProduct, "Failed to fetch product details", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Product>, t: Throwable) {
                Log.e("ViewProduct", "Error fetching product details", t)
                Toast.makeText(this@ViewProduct, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun updateUI(product: Product) {
        itemNameTextView.text = product.ProductName
        itemPriceTextView.text = "LKR ${product.Price}"
        itemDescriptionTextView.text = product.Description

        try {
            val imageBytes = Base64.decode(product.ImageBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            imageView.setImageBitmap(bitmap)
        } catch (e: Exception) {
            Log.e("ViewProduct", "Error decoding image", e)
        }
    }

    private fun addToCart(productId: String) {
        // Retrieve token from SharedPreferences
        val sharedPreferences = getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        val token = sharedPreferences.getString("token", null)

        if (token != null) {
            val apiService = RetrofitInstance.api
            apiService.addToCart(productId, "Bearer $token").enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@ViewProduct, "Product added to cart", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this@ViewProduct, "Failed to add product to cart", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Log.e("ViewProduct", "Error adding product to cart", t)
                    Toast.makeText(this@ViewProduct, "Network error", Toast.LENGTH_SHORT).show()
                }
            })
        } else {
            Toast.makeText(this, "User not authenticated. Please login first.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun placeOrder(productId: String, quantity: Int) {
        val sharedPreferences = getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        val token = sharedPreferences.getString("token", null)

        if (token != null) {
            val orderRequest = PlaceOrderRequest(productId, quantity)
            val apiService = RetrofitInstance.api
            apiService.placeOrder(productId, "Bearer $token", orderRequest).enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@ViewProduct, "Order placed successfully", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this@ViewProduct, "Failed to place order", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Log.e("ViewProduct", "Error placing order", t)
                    Toast.makeText(this@ViewProduct, "Network error", Toast.LENGTH_SHORT).show()
                }
            })
        } else {
            Toast.makeText(this, "User not authenticated. Please login first.", Toast.LENGTH_SHORT).show()
        }
    }
}
