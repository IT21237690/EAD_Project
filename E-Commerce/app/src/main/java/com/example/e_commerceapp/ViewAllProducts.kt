package com.example.e_commerceapp

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import android.widget.EditText
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ViewAllProducts : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var productAdapter: ProductAdapter
    private val productList = mutableListOf<Product>()
    private lateinit var searchbar: EditText
    private val filteredProductList = mutableListOf<Product>()
    private var selectedCategory: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_all_products)


        recyclerView = findViewById(R.id.AllProductView)
        productAdapter = ProductAdapter(emptyList())
        recyclerView.adapter = productAdapter
        recyclerView.layoutManager = GridLayoutManager(this, 2)

        searchbar = findViewById(R.id.searchbar)

        // Get the selected category from the intent
        selectedCategory = intent.getStringExtra("CATEGORY")?.lowercase()

        fetchProducts()

        // TextWatcher to handle search
        searchbar.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterProducts(s.toString())
            }

            override fun afterTextChanged(s: Editable?) {}
        })

        val fab: FloatingActionButton = findViewById(R.id.fab)
        fab.contentDescription = "Add item"

    }

    private fun fetchProducts() {
        val apiService = RetrofitInstance.api
        apiService.getProducts().enqueue(object : Callback<List<Product>> {
            override fun onResponse(call: Call<List<Product>>, response: Response<List<Product>>) {
                if (response.isSuccessful && response.body() != null) {
                    val products = response.body()!!.take(100)  // Take first 100 products
                    productList.clear()
                    productList.addAll(products)
                    filteredProductList.addAll(productList)

                    productAdapter = ProductAdapter(filteredProductList)
                    recyclerView.adapter = productAdapter
                    filterProductsByCategory()
                } else {
                    Log.e("ViewAllProducts", "API response is unsuccessful or empty.")
                }
            }

            override fun onFailure(call: Call<List<Product>>, t: Throwable) {
                t.printStackTrace() // Handle failure
            }
        })
    }

    // Function to filter products based on search query
    private fun filterProducts(query: String) {
        val lowerCaseQuery = query.lowercase()

        // Filter the products based on the search query
        val filteredList = productList.filter { product ->
            product.ProductName.lowercase().contains(lowerCaseQuery) &&
                    product.Category.lowercase() == selectedCategory
        }

        // Optimizing updates
        applyProductListChanges(filteredList)
    }

    // Filter products by category initially
    private fun filterProductsByCategory() {
        filteredProductList.clear()
        filteredProductList.addAll(productList.filter { it.Category.lowercase() == selectedCategory })
        productAdapter.notifyDataSetChanged()  // Notify the adapter after filtering
    }

    private fun applyProductListChanges(newFilteredList: List<Product>) {
        val originalSize = filteredProductList.size
        filteredProductList.clear()

        // Handle removal of products (if original size is larger than new list)
        if (originalSize > newFilteredList.size) {
            for (i in originalSize - 1 downTo newFilteredList.size) {
                productAdapter.notifyItemRemoved(i)
            }
        }

        // Add the new filtered list to the adapter
        filteredProductList.addAll(newFilteredList)

        // If the new list has more items, we notify about insertion
        if (newFilteredList.size > originalSize) {
            productAdapter.notifyItemRangeInserted(originalSize, newFilteredList.size - originalSize)
        }

        // Otherwise, if the size matches, notify that items have changed
        if (newFilteredList.size == originalSize) {
            productAdapter.notifyItemRangeChanged(0, originalSize)
        }
    }
}