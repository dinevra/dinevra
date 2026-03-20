package com.dinevra.pos.ui.order

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.util.UUID

data class MenuItem(val id: String, val name: String, val price: Double, val category: String)
data class CartItem(val item: MenuItem, var quantity: Int = 1)

val dummyMenu = listOf(
    MenuItem("1", "Classic Burger", 12.50, "Mains"),
    MenuItem("2", "Cheese Pizza", 14.00, "Mains"),
    MenuItem("3", "Caesar Salad", 8.00, "Sides"),
    MenuItem("4", "Fries", 4.50, "Sides"),
    MenuItem("5", "Cola", 2.50, "Drinks"),
    MenuItem("6", "Iced Tea", 3.00, "Drinks")
)

@Composable
fun POSLayout(onCheckout: (String) -> Unit) {
    var selectedCategory by remember { mutableStateOf("Mains") }
    val categories = listOf("Mains", "Sides", "Drinks", "Desserts")
    
    val cart = remember { mutableStateListOf<CartItem>() }
    val cartTotal = cart.sumOf { it.item.price * it.quantity }

    Row(modifier = Modifier.fillMaxSize().background(Color(0xFFF3F4F6))) {
        
        // LEFT PANE: Categories & Items (2/3 width)
        Column(modifier = Modifier.weight(2f).padding(16.dp)) {
            Text("Dinevra POS", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
            
            // Category Ribbon
            Row(modifier = Modifier.padding(vertical = 16.dp).fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                categories.forEach { cat ->
                    Button(
                        onClick = { selectedCategory = cat },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (selectedCategory == cat) Color(0xFF4F46E5) else Color.White,
                            contentColor = if (selectedCategory == cat) Color.White else Color.Black
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.height(48.dp).weight(1f)
                    ) {
                        Text(cat)
                    }
                }
            }

            // Items Grid
            val filteredItems = dummyMenu.filter { it.category == selectedCategory }
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(filteredItems) { item ->
                    Card(
                        modifier = Modifier
                            .height(120.dp)
                            .clickable {
                                val existing = cart.find { it.item.id == item.id }
                                if (existing != null) {
                                    existing.quantity++
                                    // Trigger recomposition workaround
                                    cart[cart.indexOf(existing)] = existing.copy()
                                } else {
                                    cart.add(CartItem(item))
                                }
                            },
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(2.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp).fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
                            Text(item.name, fontWeight = FontWeight.Medium, fontSize = 16.sp)
                            Text("$${String.format("%.2f", item.price)}", color = Color(0xFF4F46E5), fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // RIGHT PANE: Cart (1/3 width)
        Surface(
            modifier = Modifier.weight(1f).fillMaxHeight(),
            color = Color.White,
            shadowElevation = 8.dp
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Current Order", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Divider(modifier = Modifier.padding(vertical = 12.dp))

                LazyColumn(modifier = Modifier.weight(1f)) {
                    items(cart) { cartItem ->
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("${cartItem.quantity}x ${cartItem.item.name}", modifier = Modifier.weight(1f))
                            Text("$${String.format("%.2f", cartItem.item.price * cartItem.quantity)}")
                        }
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 12.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    Text("$${String.format("%.2f", cartTotal)}", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4F46E5))
                }

                Button(
                    onClick = { if (cartTotal > 0) onCheckout(cartTotal.toString()) },
                    modifier = Modifier.fillMaxWidth().padding(top = 16.dp).height(64.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Charge $${String.format("%.2f", cartTotal)}", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
