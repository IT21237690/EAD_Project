package com.example.e_commerceapp

import android.os.Bundle
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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home_page)

        recyclerView = findViewById(R.id.NewerView)


        recyclerView.layoutManager = GridLayoutManager(this, 2)

        fetchProducts()

        val fab: FloatingActionButton = findViewById(R.id.fab)
        fab.contentDescription = "Add item"



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