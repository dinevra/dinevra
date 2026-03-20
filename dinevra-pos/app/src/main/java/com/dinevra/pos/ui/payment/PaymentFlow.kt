package com.dinevra.pos.ui.payment

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun PaymentFlow(totalAmount: String, onPaymentSuccess: () -> Unit, onCancel: () -> Unit) {
    var paymentState by remember { mutableStateOf("SELECT_METHOD") } // SELECT_METHOD, CONNECTING, WAITING_TAP, PROCESSING, SUCCESS

    LaunchedEffect(paymentState) {
        when (paymentState) {
            "CONNECTING" -> {
                delay(1500) // mock connecting to reader
                paymentState = "WAITING_TAP"
            }
            "PROCESSING" -> {
                delay(2000) // mock stripe backend
                paymentState = "SUCCESS"
            }
            "SUCCESS" -> {
                delay(2000)
                onPaymentSuccess()
            }
        }
    }

    Surface(modifier = Modifier.fillMaxSize(), color = Color(0xFFF9FAFB)) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Card(
                modifier = Modifier.width(600.dp).padding(32.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(4.dp)
            ) {
                Column(
                    modifier = Modifier.padding(32.dp).fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    when (paymentState) {
                        "SELECT_METHOD" -> {
                            Text("Select Payment Method", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                            Text("Total Due: $$totalAmount", fontSize = 32.sp, fontWeight = FontWeight.Black, color = Color(0xFF4F46E5), modifier = Modifier.padding(vertical = 24.dp))
                            
                            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                Button(onClick = { paymentState = "CONNECTING" }, modifier = Modifier.height(64.dp).weight(1f)) {
                                    Text("Credit / Debit Card")
                                }
                                Button(onClick = onPaymentSuccess, modifier = Modifier.height(64.dp).weight(1f), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))) {
                                    Text("Cash")
                                }
                            }
                            TextButton(onClick = onCancel, modifier = Modifier.padding(top = 16.dp)) {
                                Text("Cancel Transaction", color = Color.Red)
                            }
                        }
                        "CONNECTING" -> {
                            CircularProgressIndicator(color = Color(0xFF4F46E5), modifier = Modifier.size(64.dp))
                            Text("Connecting to Stripe BBPOS Reader...", fontSize = 20.sp, modifier = Modifier.padding(top = 24.dp), color = Color.Gray)
                        }
                        "WAITING_TAP" -> {
                            OutlinedButton(onClick = { paymentState = "PROCESSING" }, modifier = Modifier.size(120.dp), shape = CircleShape) {
                                Text("TAP CARD", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            }
                            Text("Please Tap, Insert, or Swipe Card", fontSize = 22.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 24.dp))
                            Text("Total Due: $$totalAmount", fontSize = 20.sp, color = Color.Gray, modifier = Modifier.padding(top = 8.dp))
                        }
                        "PROCESSING" -> {
                            CircularProgressIndicator(color = Color(0xFF10B981), modifier = Modifier.size(64.dp))
                            Text("Processing Payment...", fontSize = 20.sp, modifier = Modifier.padding(top = 24.dp), color = Color.Gray)
                        }
                        "SUCCESS" -> {
                            Surface(color = Color(0xFF10B981), shape = CircleShape, modifier = Modifier.size(80.dp)) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text("✓", color = Color.White, fontSize = 48.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                            Text("Payment Successful!", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981), modifier = Modifier.padding(top = 24.dp))
                            Text("Order sent to Kitchen.", fontSize = 16.sp, color = Color.Gray, modifier = Modifier.padding(top = 8.dp))
                        }
                    }
                }
            }
        }
    }
}
