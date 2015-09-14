import java.io.IOException;
import java.io.PrintWriter;
import java.net.*;

import org.joda.time.DateTime;


public class Flood
{
	private static final int TCP = 0;
	private static final int UDP = 1;

	static long startTime = System.currentTimeMillis();
	static long count = 0;
	static long lastReportTime = 0;
	static long lastCount = 0;
	static Socket s = null;
	static PrintWriter out;
	static DatagramSocket ds = null;
	static String server = "localhost";
	static int port = 5000;

	static String staticPart = ",\"-118,35\",1.0";

	static int method = UDP;
	static long maxCount = 10000000;
	static long rate = 40;
	static int typeIndex = 0;
	static long track = 1;


	public static void main(String[] args)
	{
		for( int i = 1; i <= 40; i++ )
			staticPart += (",string"+i);
		if( args.length > 0 )
			server = args[0];
		if( args.length > 1 )
		{
			try{ port = Integer.parseInt(args[1]); } catch( NumberFormatException ex ){}
		}
		if( args.length > 2 )
		{
			try{ rate = Integer.parseInt(args[2]); } catch( NumberFormatException ex ){}
		}
		try
		{
			rate = rate / 10;
			while(true)
			{
				long startTime = System.currentTimeMillis();
				for(int i = 0; i < rate; i++ )
				{
					if( method == TCP )
						sendTCP(makeMessage());
					if( method == UDP )
						sendUDP(makeMessage());
				}
				long endTime = System.currentTimeMillis();
				long sleepTime = 100;
				if( endTime > startTime )
					sleepTime -= (endTime-startTime);
				if( sleepTime > 0 )
				{
					try
					{
						Thread.sleep(sleepTime);
					}catch(InterruptedException ex)
					{
						ex.printStackTrace();
					}
				}
			}
		}catch(IOException ex)
		{
			ex.printStackTrace();
		}
	}

	private static String makeMessage()
	{
		DateTime now = new DateTime();
		String currentTimeString = now.toString();
		typeIndex = (typeIndex + 1) % 5;
		return "W"+typeIndex+","+(track++)+","+currentTimeString+staticPart;
	}

	private static void sendUDP(String line) throws IOException
	{
		//System.out.println("Sending " + line);
		line += "\n";
		if( ds == null )
		{
			ds = new DatagramSocket();
		}
		byte[] buf = line.getBytes("UTF-8");
		DatagramPacket packet = new DatagramPacket(buf, buf.length, InetAddress.getByName(server), port);
		ds.send(packet);
		count();
	}

	private static void sendTCP(String line) throws IOException
	{
		if(s == null)
		{
			s = new Socket( server, port );
			out = new PrintWriter(s.getOutputStream());
		}
		//System.out.println("Sending " + line);
		out.println(line);
		out.flush();
		count();

	}

	private static void count() throws IOException
	{
		count++;
		if( count - lastCount > 100 )
		{
			long now = System.currentTimeMillis();
			if( now - lastReportTime > 1000 )
			{
				lastReportTime = now;
				lastCount = count;
				double rate = count;
				long time = now - startTime;
				rate = rate * 1000 / time;
				System.out.format("The message rate is %9.1f (%8d total).%n", rate, count);
			}
		}
		if( count >= maxCount  )
		{
			if( s != null )
				s.close();
			System.exit(0);
		}
	}
}
