package com.example.e_commerceapp

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import androidx.compose.material3.FloatingActionButton
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.floatingactionbutton.FloatingActionButton

class HomePage : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var productAdapter: ProductAdapter
    private val productList = mutableListOf<Product>()
    private lateinit var textViewForAllProducts: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home_page)

        // Category buttons
        val electronicsImageView: ImageView = findViewById(R.id.imageViewElectronics)
        val homeImageView: ImageView = findViewById(R.id.imageViewHome)
        val fashionImageView: ImageView = findViewById(R.id.imageViewFashion)

        // Set up click listeners
        electronicsImageView.setOnClickListener {
            navigateToViewAllProducts("Electronics")
        }

        homeImageView.setOnClickListener {
            navigateToViewAllProducts("Home & Living")
        }

        fashionImageView.setOnClickListener {
            navigateToViewAllProducts("Fashion")
        }

        // Retrieve the email passed from Login.kt
        val userEmail = intent.getStringExtra("user_email")

        recyclerView = findViewById(R.id.NewerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2)

        fetchProducts()

        textViewForAllProducts = findViewById(R.id.seeAllProducts)
        textViewForAllProducts.setOnClickListener {
            val intent = Intent(this, ViewAndSearchAll::class.java)
            startActivity(intent)
        }

        // Handle ImageView click for navigating to UserProfile
        val userIcon: ImageView = findViewById(R.id.UserIcon)
        userIcon.setOnClickListener {
            val intent = Intent(this, UserProfile::class.java)
            intent.putExtra("user_email", userEmail)  // Pass the email to UserProfile
            startActivity(intent)
        }

        val fab: FloatingActionButton = findViewById(R.id.fab)
        fab.contentDescription = "Add item"





    }

    // Function to navigate to the ViewAllProducts activity
    private fun navigateToViewAllProducts(category: String) {
        val intent = Intent(this, ViewAllProducts::class.java)
        intent.putExtra("CATEGORY", category)  // Pass the selected category
        startActivity(intent)
    }

    private fun fetchProducts() {
        val apiService = RetrofitInstance.api
        apiService.getProducts().enqueue(object : Callback<List<Product>> {
            override fun onResponse (call: Call<List<Product>>, response: Response<List<Product>>){
                if (response.isSuccessful && response.body() != null) {
                    // Limit to 5 products
                    val products = response.body()!!.take(5)
                    productList.clear()
                    productList.addAll(products)

                    productAdapter = ProductAdapter(productList)
                    recyclerView.adapter = productAdapter
                }
            }

            override fun onFailure(call: Call<List<Product>>, t: Throwable) {
                // Handle failure
                t.printStackTrace()
            }
        })
    }
}