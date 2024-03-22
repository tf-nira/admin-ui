package io.mosip.testrig.adminui.utility;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.Reporter;

import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.MediaEntityBuilder;

import io.mosip.testrig.adminui.kernel.util.ConfigManager;

public class Commons  extends BaseClass{
	private static final Logger logger = Logger.getLogger(Commons.class);

	public static String appendDate=getPreAppend()+getDateTime();
	
	public static String getDateTime()
	  {
		
	
	DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
	   LocalDateTime now = LocalDateTime.now();
	   return dtf.format(now);
	  }
	
	public  static void filter(ExtentTest test,WebDriver driver, By by,String data) throws IOException {
		try {
		logger.info("Inside Filter " + by + data);
		Commons.click(test,driver, By.id("Filter")); 
		Thread.sleep(3000);
		Commons.enter(test,driver, by, data); 
		Thread.sleep(3000);
		Commons.click(test,driver, By.id("applyTxt"));
		}
		catch (Exception e) {
			Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

			logger.info(e.getMessage());
			try {
				test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			JavascriptExecutor executor = (JavascriptExecutor) driver;
			executor.executeScript("arguments[0].click();", driver.findElement(by));

		}
	}
	
	public  static void filterCenter(ExtentTest test,WebDriver driver, By by,String data) throws IOException {
		logger.info("Inside filterCenter " + by + data);
		try {
		Commons.click(test,driver, By.id("Filter")); 
	
		Commons.dropdowncenter(test,driver, by, data); 
		
		Commons.click(test,driver, By.id("applyTxt")); 
		}
		catch (Exception e) {
			Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

			logger.info(e.getMessage());
			try {
				test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			JavascriptExecutor executor = (JavascriptExecutor) driver;
			executor.executeScript("arguments[0].click();", driver.findElement(by));

		}
	}
	public  static void click(ExtentTest test,WebDriver driver, By by) throws IOException {
		logger.info("Clicking " + by );
		try {
			(new WebDriverWait(driver, 20)).until(ExpectedConditions.elementToBeClickable(by));
			Thread.sleep(1000);
			driver.findElement(by).click();
			Thread.sleep(500);
		}catch (StaleElementReferenceException sere) {
			Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

			// simply retry finding the element in the refreshed DOM
			logger.error( sere.getMessage());
			driver.findElement(by).click();
		}
		catch (TimeoutException toe) {
	//		Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

			logger.error( toe.getMessage());
			driver.findElement(by).click();
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				logger.error( e.getMessage());
				e.printStackTrace();
			}
			logger.info( "Element identified by " + by.toString() + " was not clickable after 20 seconds");
		} catch (Exception e) {
		//	Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

			logger.error( e.getMessage());
			try {
				test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				logger.error( e1.getMessage());
				e1.printStackTrace();
			}
			JavascriptExecutor executor = (JavascriptExecutor) driver;
			executor.executeScript("arguments[0].click();", driver.findElement(by));

	     
	  }
		
//		try {
//			Thread.sleep(5000);
//			JavascriptExecutor executor = (JavascriptExecutor) driver;
//			executor.executeScript("arguments[0].click();", driver.findElement(by));
//			
//		}catch(Exception e) {
//			logger.error( e.getMessage());
//			Assert.fail();
//		}
		
	}
  
	public static void enter(ExtentTest test,WebDriver driver, By by,String value) throws IOException {
		logger.info("Entering " + by +value);
			try {
				(new WebDriverWait(driver, 20)).until(ExpectedConditions.visibilityOfElementLocated(by));
				driver.findElement(by).clear();
				driver.findElement(by).sendKeys(value);
				try {
					Thread.sleep(8);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}catch (StaleElementReferenceException sere) {
				Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

				// simply retry finding the element in the refreshed DOM
				driver.findElement(by).sendKeys(value);
			}
			catch (TimeoutException toe) {
				Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

				driver.findElement(by).sendKeys(value);
				logger.info( "Element identified by " + by.toString() + " was not clickable after 20 seconds");
			} 
			catch (Exception e) {
				Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

				try {
					test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				JavascriptExecutor executor = (JavascriptExecutor) driver;
				executor.executeScript("arguments[0].click();", driver.findElement(by));

			}
			
	}
	
	public static void dropdown(ExtentTest test,WebDriver driver, By by) throws IOException
	  {
		logger.info("Selecting DropDown Index Zero Value " + by );
		  
		 try {
			 Thread.sleep(500);
			 click(test,driver,by);//REGION
				Thread.sleep(500);
			
		   String att= driver.findElement(by).getAttribute("aria-owns");
		   String[] list=att.split(" ");
		    click(test,driver,By.id(list[0]));
		    try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		 }catch (Exception e) {
				Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

				try {
					test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				JavascriptExecutor executor = (JavascriptExecutor) driver;
				executor.executeScript("arguments[0].click();", driver.findElement(by));

			}
	  }
	
	public static void dropdown(ExtentTest test,WebDriver driver, By by,String value)
	  {
		logger.info("Selecting DropDown By Value " + by +value );
		  
		 try {
			 Thread.sleep(500);
			 click(test,driver,by);
				Thread.sleep(500);
			   String val="'"+value +"'";
		   
		    click(test,driver,By.xpath("//span[contains(text(),"+val+")]"));
		    try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		 }catch (Exception e) {
			 logger.info(e.getMessage());
				try {
					test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				JavascriptExecutor executor = (JavascriptExecutor) driver;
				executor.executeScript("arguments[0].click();", driver.findElement(by));

			}
	  }
	
	public static void dropdowncenter(ExtentTest test,WebDriver driver, By by,String value)
	  {
		logger.info("Selecting DropDown By Value " + by +value );
		  
		 try {
			 Thread.sleep(500);
			 click(test,driver,by);
				Thread.sleep(500);
			   String val="'"+value +"'";
		   
		    click(test,driver,By.id(value));
		    try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		 }catch (Exception e) {
			 logger.info(e.getMessage());
				try {
					test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				JavascriptExecutor executor = (JavascriptExecutor) driver;
				executor.executeScript("arguments[0].click();", driver.findElement(by));

			}
	  }
	
	public static void dropdown(ExtentTest test,WebDriver driver, By by,By value)
	  {
		logger.info("Selecting DropDown By Value " + by +value );
		 try {  
			 Thread.sleep(500);
			 click(test,driver,by);
			 Thread.sleep(500);
		    click(test,driver,value);
		  
				Thread.sleep(500);
			
		 }catch (Exception e) {
			 logger.info(e.getMessage());
				try {
					
					test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				JavascriptExecutor executor = (JavascriptExecutor) driver;
				executor.executeScript("arguments[0].click();", driver.findElement(by));

			}
	  }
	public static String getTestData()
	{
		return JsonUtil.readJsonFileText("TestData.json");
	}
	

	

	public static void deactivate(ExtentTest test,WebDriver driver) throws IOException {
		Commons.click(test,driver,By.id("ellipsis-button0"));
		Commons.click(test,driver, By.id("Deactivate0")); 

	    Commons.click(test,driver,By.id("confirmpopup")); 
		Commons.click(test,driver, By.id("confirmmessagepopup")); 
		 logger.info("Click deactivate and Confirm");
	}

	public static void activate(ExtentTest test,WebDriver driver) throws IOException {
		Commons.click(test,driver,By.id("ellipsis-button0"));
		Commons.click(test,driver, By.id("Activate0")); 

	    Commons.click(test,driver,By.id("confirmpopup")); 
		Commons.click(test,driver, By.id("confirmmessagepopup")); 
		 logger.info("Click activate and Confirm");
	}

	public static void edit(ExtentTest test,WebDriver driver,String data,By by) {
	
		try {
		Commons.click(test,driver,By.id("ellipsis-button0"));
		Commons.click(test,driver, By.id("Edit0")); 
		
		Assert.assertNotEquals(data,
				driver.findElement(by).getText());
		driver.findElement(by).clear();

		Commons.enter(test,driver, by, data);

		Commons.click(test,driver, By.id("createButton"));
		Commons.click(test,driver,By.id("confirmpopup"));
		Commons.click(test,driver, By.id("confirmmessagepopup")); 

		 logger.info("Click Edit and Confirm" + by + data);
		}
		catch (Exception e) {
			logger.info(e.getMessage());
			try {
				test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			JavascriptExecutor executor = (JavascriptExecutor) driver;
			executor.executeScript("arguments[0].click();", driver.findElement(by));

		}
	}

	public static void editRes(ExtentTest test,WebDriver driver,String data,By by) throws IOException {
		try {
		Commons.click(test,driver,By.id("ellipsis-button0"));
		Commons.click(test,driver, By.id("Edit0")); 
		Thread.sleep(3000);
		Assert.assertNotEquals(data,
				driver.findElement(by).getText());
		Thread.sleep(3000);
		driver.findElement(by).clear();

		Commons.enter(test,driver, by, data);

		Commons.click(test,driver, By.id("createButton"));

	    Commons.click(test,driver,By.id("confirmpopup")); 
			Commons.click(test,driver, By.id("confirmmessagepopup")); 

			 logger.info("Click Edit and Confirm" + by + data);
			 }catch (Exception e) {
					Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

				 logger.info(e.getMessage());
					try {
						test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
					} catch (IOException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
					JavascriptExecutor executor = (JavascriptExecutor) driver;
					executor.executeScript("arguments[0].click();", driver.findElement(by));

				}
	}
	public static void editCenter(ExtentTest test,WebDriver driver,String data,By by) {
		try {
		Commons.click(test,driver,By.id("ellipsis-button0"));
		Commons.click(test,driver, By.id("Edit0")); 
		
		Assert.assertNotEquals(data,
				driver.findElement(by).getText());
		driver.findElement(by).clear();

		Commons.enter(test,driver, by, data);

		Commons.click(test,driver, By.xpath("(//*[@id='createButton'])[1]"));

	    Commons.click(test,driver,By.id("confirmpopup")); 
			Commons.click(test,driver, By.id("confirmmessagepopup")); 

			Commons.click(test,driver,  By.xpath("(//*[@id='cancel'])[1]"));
			Commons.click(test,driver,  By.xpath("(//*[@id='cancel'])[1]"));
			 logger.info("Click editCenter and Confirm" + by + data);
		}
		catch (Exception e) {
			logger.info(e.getMessage());
			try {
				test.fail(e.getMessage(), MediaEntityBuilder.createScreenCaptureFromBase64String(Screenshot.ClickScreenshot(driver)).build());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			JavascriptExecutor executor = (JavascriptExecutor) driver;
			executor.executeScript("arguments[0].click();", driver.findElement(by));

		}
	}
	
	public static void create(ExtentTest test,WebDriver driver) throws IOException {
		
		Commons.click(test,driver, By.xpath("//button[@id='createButton']")); 
		Commons.click(test,driver, By.id("confirmpopup")); 
		Commons.click(test,driver, By.id("confirmmessagepopup"));
		logger.info("Click create");
	}
	public static void createRes(ExtentTest test,WebDriver driver) throws IOException {
		 try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		Commons.click(test,driver, By.xpath("//button[@id='createButton']")); 
		 Commons.click(test,driver,By.id("confirmpopup")); 
		Commons.click(test,driver, By.id("confirmmessagepopup")); 
		logger.info("Click and confirm");
	}

	public static void decommission(ExtentTest test,WebDriver driver) throws IOException {
		 Commons.click(test,driver,By.id("ellipsis-button0"));
		    Commons.click(test,driver,By.id("Decommission0"));

		    Commons.click(test,driver,By.id("confirmpopup")); 
			Commons.click(test,driver, By.id("confirmmessagepopup")); 
			logger.info("Click decommission and confirm");
	}
	public static String getPreAppend() 
	  {
	String preappend = null;
	try {
		preappend =ConfigManager.getpreappend();
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return preappend;
	  }
	
	public static void calendar(String date) throws IOException {
		String a=date.replaceAll("/","");
	    String mon="";
	    if(a.substring(0,2).equals("10")) {
	    	 mon=	a.substring(0,2);
	    }else {
	    	 mon=a.substring(0,2).replace("0","");
	    }
	  String d="";
	  if(a.substring(2,4).equals("10") || a.substring(2,4).equals("20")||a.substring(2,4).equals("30")) {
		  d=a.substring(2,4);
	  }else {
	 	 d=a.substring(2,4).replace("0","");
	 }

	    int month=Integer.parseInt(mon)  ;
	    int day=Integer.parseInt(d);
	    int year=Integer.parseInt(a.substring(4,8));
	    try {
	    Commons.click(test,driver,By.xpath("//*[@class='mat-datepicker-toggle']//button"));
	    Thread.sleep(500);
	    Commons.click(test,driver,By.xpath("//*[@class='mat-calendar-arrow']"));
	    Thread.sleep(500);
	    Commons.click(test,driver,By.xpath("//*[text()='"+year+"']"));
	    Thread.sleep(500);
	  List<WebElement> cli=  driver.findElements(By.xpath("//*[@class='mat-calendar-body-cell-content']"));
	  cli.get(month-1).click();
	  Thread.sleep(500);
	  Commons.click(test,driver,By.xpath("//*[text()='"+day+"']"));
	    }catch (Exception e) {
			Reporter.log("<p><img src='data:image/png;base64," + Screenshot.ClickScreenshot(driver) + "' width='900' height='450'/></p>");

			// TODO Auto-generated catch block
			e.printStackTrace();
			logger.info(e.getMessage());
		}
	}
	
}
